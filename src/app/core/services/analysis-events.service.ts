import { Injectable, inject, NgZone } from '@angular/core';
import { Store } from '@ngrx/store';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { ApiConfiguration } from '@core/api/api-configuration';
import { AnalysisUpdateEvent } from '@core/api/models/analysis-update-event';
import * as AnalysisActions from '../../store/analysis/analysis.actions';

/** Thrown from onerror to stop the retry loop permanently (auth failure, explicit disconnect). */
class FatalSseError extends Error {}

/**
 * Thrown from onclose so fetchEventSource re-enters the retry loop after a
 * normal server-side close (e.g. the 5-minute stream timeout).
 * Distinguished from real network errors so it never counts against retryCount.
 */
class ServerClosedSseError extends Error {}

const TAG = '[SSE]';

@Injectable({ providedIn: 'root' })
export class AnalysisEventsService {
  private readonly store = inject(Store);
  private readonly ngZone = inject(NgZone);
  private readonly config = inject(ApiConfiguration);

  private get sseUrl(): string {
    return `${this.config.rootUrl}/api/v1/analysis/events`;
  }

  private abortController: AbortController | null = null;
  private token: string | null = null;

  /** Backoff delay for genuine network errors only. */
  private errorDelay = 2000;
  private readonly maxErrorDelay = 30_000;

  /** Counts only genuine network / server errors — NOT normal server closes. */
  private errorCount = 0;
  private readonly maxErrors = 10;

  private _connected = false;

  get isConnected(): boolean {
    return this._connected;
  }

  /** Call after login / page-reload with a valid JWT. Idempotent. */
  connect(token: string): void {
    if (this._connected && this.token === token) {
      return;
    }
    this.disconnect();
    this.token = token;
    this.resetErrorState();
    this.openStream();
  }

  /** Call on logout. Aborts the stream and clears all state. */
  disconnect(): void {
    this.token = null;
    this._connected = false;
    this.abortController?.abort();
    this.abortController = null;
  }

  /** Safety valve: called by DashboardLayout on visibilitychange / page focus. */
  reconnectIfNeeded(): void {
    if (this.token && !this._connected) {
      this.resetErrorState();
      this.openStream();
    }
  }

  private resetErrorState(): void {
    this.errorDelay = 2000;
    this.errorCount = 0;
  }

  private openStream(): void {
    if (!this.token) {
      return;
    }

    this.abortController = new AbortController();
    const { signal } = this.abortController;
    const token = this.token;
    const url = this.sseUrl;

    this.ngZone.runOutsideAngular(() => {
      fetchEventSource(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'text/event-stream',
        },
        signal,
        openWhenHidden: true,

        onopen: async (response) => {

          if (response.status === 401 || response.status === 403) {
            console.error(TAG, 'onopen – auth rejected, stopping retries.');
            throw new FatalSseError('SSE: Unauthorized');
          }
          if (!response.ok) {
            console.error(TAG, 'onopen – non-OK, will retry. Status:', response.status);
            throw new Error(`SSE: unexpected status ${response.status}`);
          }
          this._connected = true;
          this.resetErrorState();
        },

        onmessage: (msg) => {

          if (msg.event === 'analysis-update') {
            try {
              const event: AnalysisUpdateEvent = JSON.parse(msg.data);
              this.ngZone.run(() =>
                this.store.dispatch(
                  AnalysisActions.analysisUpdateReceived({ event }),
                ),
              );
            } catch (parseErr) {
              console.error(TAG, 'onmessage – failed to parse payload:', msg.data, parseErr);
            }
          } else {
          }
        },

        onclose: () => {
          this._connected = false;
          throw new ServerClosedSseError();
        },

        onerror: (err) => {
          this._connected = false;

          if (signal.aborted) {
            throw err;
          }

          if (err instanceof FatalSseError) {
            console.error(TAG, 'onerror – fatal, stopping retry loop:', err.message);
            throw err;
          }

          if (err instanceof ServerClosedSseError) {
            return 0;
          }

          this.errorCount++;
          console.error(
            TAG,
            `onerror – error ${this.errorCount}/${this.maxErrors}.`,
            'Will retry in', this.errorDelay, 'ms.',
            'Error:', err,
          );

          if (this.errorCount > this.maxErrors) {
            console.error(TAG, 'onerror – max errors reached, giving up.');
            throw new FatalSseError('Max errors exceeded');
          }

          const delay = this.errorDelay;
          this.errorDelay = Math.min(this.errorDelay * 2, this.maxErrorDelay);
          return delay;
        },
      });
    });
  }
}

