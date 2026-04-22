import { createReducer, on } from '@ngrx/store';
import { AnalysisUpdateEvent } from '@core/api/models/analysis-update-event';
import * as AnalysisActions from './analysis.actions';
import * as AuthActions from '../auth/auth.actions';

export interface AnalysisState {
  /** Latest SSE update per documentId */
  updates: Record<string, AnalysisUpdateEvent>;
  /** documentIds currently being retried */
  retrying: Record<string, boolean>;
  retryErrors: Record<string, string>;
}

export const initialState: AnalysisState = {
  updates: {},
  retrying: {},
  retryErrors: {},
};

export const analysisReducer = createReducer(
  initialState,
  on(AnalysisActions.analysisUpdateReceived, (state, { event }) => ({
    ...state,
    updates: { ...state.updates, [event.documentId]: event },
  })),
  on(AnalysisActions.retryAnalysis, (state, { documentId }) => ({
    ...state,
    retrying: { ...state.retrying, [documentId]: true },
    retryErrors: { ...state.retryErrors, [documentId]: '' },
  })),
  on(AnalysisActions.retryAnalysisSuccess, (state, { documentId }) => ({
    ...state,
    retrying: { ...state.retrying, [documentId]: false },
  })),
  on(AnalysisActions.retryAnalysisFailure, (state, { documentId, error }) => ({
    ...state,
    retrying: { ...state.retrying, [documentId]: false },
    retryErrors: { ...state.retryErrors, [documentId]: error },
  })),
  on(AuthActions.logout, () => initialState),
);
