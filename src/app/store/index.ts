import { ActionReducerMap } from '@ngrx/store';
import { AuthState, authReducer } from './auth/auth.reducer';
import { UserState, userReducer } from './user/user.reducer';

export interface AppState {
  auth: AuthState;
  user: UserState;
}

export const appStore: ActionReducerMap<AppState> = {
  auth: authReducer,
  user: userReducer,
};
