import { ActionReducerMap } from '@ngrx/store';
import { AuthState, authReducer } from './auth/auth.reducer';
import { UserState, userReducer } from './user/user.reducer';
import { AnalysisState, analysisReducer } from './analysis/analysis.reducer';

export interface AppState {
  auth: AuthState;
  user: UserState;
  analysis: AnalysisState;
}

export const appStore: ActionReducerMap<AppState> = {
  auth: authReducer,
  user: userReducer,
  analysis: analysisReducer,
};
