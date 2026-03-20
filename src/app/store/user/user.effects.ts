import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as UserActions from './user.actions';
import { ProfileService } from '@core/services/profile.service';

@Injectable()
export class UserEffects {
  loadProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadProfile),
      switchMap(() =>
        this.profileService.getProfile().pipe(
          map((profile) => UserActions.loadProfileSuccess({ profile })),
          catchError((err) =>
            of(
              UserActions.loadProfileFailure({
                error:
                  err.error?.message ??
                  err.message ??
                  'Profil betöltése sikertelen.',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  saveProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.saveProfile),
      switchMap(({ request }) =>
        this.profileService.updateProfile(request).pipe(
          map((profile) => UserActions.saveProfileSuccess({ profile })),
          catchError((err) =>
            of(
              UserActions.saveProfileFailure({
                error:
                  err.error?.message ??
                  err.message ??
                  'Profil mentése sikertelen.',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  constructor(
    private actions$: Actions,
    private profileService: ProfileService,
  ) {}
}
