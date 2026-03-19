import { ActionReducerMap } from '@ngrx/store';
import { AuthState, authReducer } from './auth/auth.reducer';

export interface AppState {
  auth: AuthState;
}

export const appStore: ActionReducerMap<AppState> = {
  auth: authReducer
};
