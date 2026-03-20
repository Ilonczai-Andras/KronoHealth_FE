import { createAction, props } from '@ngrx/store';
import { UserProfile } from '@core/api/models/user-profile';
import { UpdateProfileRequest } from '@core/api/models/update-profile-request';

export const loadProfile = createAction('[Profile] Load Profile');

export const loadProfileSuccess = createAction(
  '[Profile] Load Profile Success',
  props<{ profile: UserProfile }>(),
);

export const loadProfileFailure = createAction(
  '[Profile] Load Profile Failure',
  props<{ error: string }>(),
);

export const saveProfile = createAction(
  '[Profile] Save Profile',
  props<{ request: UpdateProfileRequest }>(),
);

export const saveProfileSuccess = createAction(
  '[Profile] Save Profile Success',
  props<{ profile: UserProfile }>(),
);

export const saveProfileFailure = createAction(
  '[Profile] Save Profile Failure',
  props<{ error: string }>(),
);
