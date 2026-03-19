import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '@core/services/auth.service';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginAction),
      switchMap(({ email, password }) =>
        this.authService.login({ email, password }).pipe(
          map(response => AuthActions.loginSuccess({ response })),
          catchError(err =>
            of(AuthActions.loginFailure({ error: err.error?.message ?? err.message ?? 'Belépés sikertelen.' }))
          )
        )
      )
    )
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerAction),
      switchMap(({ name, email, password }) =>
        this.authService.register({ name, email, password }).pipe(
          map(response => AuthActions.registerSuccess({ response })),
          catchError(err =>
            of(AuthActions.registerFailure({ error: err.error?.message ?? err.message ?? 'Regisztráció sikertelen.' }))
          )
        )
      )
    )
  );

  authSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess, AuthActions.registerSuccess),
      tap(({ response }) => {
        if (response.access_token) {
          localStorage.setItem('kh_token', response.access_token);
        }
        this.router.navigate(['/app/dashboard']);
      })
    ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}
}
