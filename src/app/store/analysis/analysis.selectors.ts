import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AnalysisState } from './analysis.reducer';

export const selectAnalysisState =
  createFeatureSelector<AnalysisState>('analysis');

export const selectAllAnalysisUpdates = createSelector(
  selectAnalysisState,
  (s) => s.updates,
);

export const selectAnalysisUpdateForDocument = (documentId: string) =>
  createSelector(selectAllAnalysisUpdates, (updates) => updates[documentId]);

export const selectIsRetrying = (documentId: string) =>
  createSelector(selectAnalysisState, (s) => !!s.retrying[documentId]);

export const selectRetryError = (documentId: string) =>
  createSelector(selectAnalysisState, (s) => s.retryErrors[documentId] ?? '');
