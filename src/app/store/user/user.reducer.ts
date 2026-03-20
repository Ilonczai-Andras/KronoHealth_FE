import { createReducer, on } from '@ngrx/store';
import { UserProfile } from '@core/api/models/user-profile';
import * as UserActions from './user.actions';

export interface UserState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
};

export const userReducer = createReducer(
  initialState,
  on(UserActions.loadProfile, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UserActions.loadProfileSuccess, (state, { profile }) => ({
    ...state,
    loading: false,
    profile,
  })),
  on(UserActions.loadProfileFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
