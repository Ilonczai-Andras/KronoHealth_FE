import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export interface AuthState {
  token: string | null;
  user: { email?: string; name?: string; role?: string } | null;
  loading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  token: null,
  user: null,
  loading: false,
  error: null
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.loginAction, AuthActions.registerAction, state => ({
    ...state, loading: true, error: null
  })),
  on(AuthActions.loginSuccess, AuthActions.registerSuccess, (state, { response }) => ({
    ...state,
    loading: false,
    token: response.access_token ?? null,
    user: {
      email: response.email,
      name: response.name,
      role: response.role
    }
  })),
  on(AuthActions.loginFailure, AuthActions.registerFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),
  on(AuthActions.logout, () => initialState)
);
