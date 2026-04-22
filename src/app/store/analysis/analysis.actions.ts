import { createAction, props } from '@ngrx/store';
import { AnalysisUpdateEvent } from '@core/api/models/analysis-update-event';

export const analysisUpdateReceived = createAction(
  '[Analysis] Update Received',
  props<{ event: AnalysisUpdateEvent }>(),
);

export const retryAnalysis = createAction(
  '[Analysis] Retry',
  props<{ documentId: string }>(),
);

export const retryAnalysisSuccess = createAction(
  '[Analysis] Retry Success',
  props<{ documentId: string }>(),
);

export const retryAnalysisFailure = createAction(
  '[Analysis] Retry Failure',
  props<{ documentId: string; error: string }>(),
);
