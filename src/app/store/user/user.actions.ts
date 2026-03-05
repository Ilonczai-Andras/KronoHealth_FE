import { createAction, props } from '@ngrx/store';

export const loadUsers = createAction(
  '[User Page] Load Users'
);

export const loadUsersSuccess = createAction(
  '[User API] Load Users Success',
  props<{ users: any[] }>()
);

export const loadUsersFailure = createAction(
  '[User API] Load Users Failure',
  props<{ error: string }>()
);
