import { Injectable, inject, NgZone } from '@angular/core';
import { Store } from '@ngrx/store';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { ApiConfiguration } from '@core/api/api-configuration';
import { AnalysisUpdateEvent } from '@core/api/models/analysis-update-event';
import * as AnalysisActions from '../../store/analysis/analysis.actions';

class FatalSseError extends Error {}

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
  private reconnectDelay = 2000;
  private readonly maxReconnectDelay = 30_000;
  private retryCount = 0;
  private readonly maxRetries = 10;
  private _connected = false;

  get isConnected(): boolean {
    return this._connected;
  }

  connect(token: string): void {
    this.disconnect();
    this.token = token;
    this.reconnectDelay = 2000;
    this.retryCount = 0;
    this.openStream();
  }

  disconnect(): void {
    this.token = null;
    this._connected = false;
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  /** Reconnect if the stream has silently closed**/
  reconnectIfNeeded(): void {
    if (this.token && !this._connected) {
      this.reconnectDelay = 2000;
      this.retryCount = 0;
      this.openStream();
    }
  }

  private openStream(): void {
    if (!this.token) return;

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

        onopen: async (response) => {
          if (response.status === 401 || response.status === 403) {
            throw new FatalSseError('SSE: Unauthorized – stopping reconnects.');
          }
          if (!response.ok) {
            throw new Error(`SSE open failed with status ${response.status}`);
          }
          this._connected = true;
          this.reconnectDelay = 2000; // reset backoff on clean open
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
            } catch {
            }
          }
        },

        onclose: () => {
          this._connected = false;
          throw new Error('SSE connection closed by server');
        },

        onerror: (err) => {
          this._connected = false;
          // Intentional abort or auth failure → stop retrying
          if (signal.aborted || err instanceof FatalSseError) {
            throw err;
          }
          this.retryCount++;
          if (this.retryCount > this.maxRetries) {
            console.warn('SSE: max retries reached, stopping reconnect attempts.');
            throw new FatalSseError('Max retries exceeded');
          }
          const delay = this.reconnectDelay;
          this.reconnectDelay = Math.min(
            this.reconnectDelay * 2,
            this.maxReconnectDelay,
          );
          return delay;
        },
      });
    });
  }
}
