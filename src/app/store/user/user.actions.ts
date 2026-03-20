import { createAction, props } from '@ngrx/store';
import { UserProfile } from '@core/api/models/user-profile';

export const loadProfile = createAction('[Profile] Load Profile');

export const loadProfileSuccess = createAction(
  '[Profile] Load Profile Success',
  props<{ profile: UserProfile }>(),
);

export const loadProfileFailure = createAction(
  '[Profile] Load Profile Failure',
  props<{ error: string }>(),
);
