import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.reducer';

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectUserProfile = createSelector(
  selectUserState,
  (s) => s.profile,
);
export const selectUserLoading = createSelector(
  selectUserState,
  (s) => s.loading,
);
export const selectUserError = createSelector(selectUserState, (s) => s.error);
