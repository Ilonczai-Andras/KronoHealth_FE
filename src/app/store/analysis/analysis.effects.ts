import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as AnalysisActions from './analysis.actions';
import { DocumentsService } from '../../core/services/documents.service';

@Injectable()
export class AnalysisEffects {
  retryAnalysis$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnalysisActions.retryAnalysis),
      switchMap(({ documentId }) =>
        this.documentsService.triggerAnalysis(documentId).pipe(
          map(() => AnalysisActions.retryAnalysisSuccess({ documentId })),
          catchError((err) =>
            of(
              AnalysisActions.retryAnalysisFailure({
                documentId,
                error:
                  err.error?.message ??
                  err.message ??
                  'Az újraelemzés sikertelen.',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  constructor(
    private actions$: Actions,
    private documentsService: DocumentsService,
  ) {}
}
