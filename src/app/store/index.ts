import { ActionReducerMap } from '@ngrx/store';

export interface AppState {
  // Define your app state slices here
  // Example: users: UserState;
}

export const appStore: ActionReducerMap<AppState> = {
  // Register your reducers here
  // Example: users: userReducer
};
