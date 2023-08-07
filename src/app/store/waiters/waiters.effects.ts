import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import { Waiter } from './waiter.model';
import { catchError, concatMap, map, switchMap, tap } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import {
  loadingWaitersFail,
  loadingWaitersSuccess,
  startLoadingWaiters,
  updateWaiter,
} from './waiters.action';

interface WaitersResponse {
  status: string;
  result: number;
  data: {
    waiters: Waiter[];
  };
}

@Injectable()
export class WaitersEffects {
  loadingWaiters = createEffect(() =>
    this.actions$.pipe(
      ofType(startLoadingWaiters),
      switchMap(() =>
        this.http
          .get<WaitersResponse>('http://localhost:3000/api/v1/waiters')
          .pipe(
            map((resData) => {
              return loadingWaitersSuccess({ waiters: resData.data.waiters });
            }),
            catchError((error) =>
              of(loadingWaitersFail({ message: error.message })),
            ),
          ),
      ),
    ),
  );

  updateWaiter = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateWaiter),
        concatMap((action) =>
          this.http
            .patch(
              'http://localhost:3000/api/v1/waiters/' + action.waiter._id,
              { isAvailable: action.waiter.isAvailable },
            )
            .pipe(
              tap(() => {
                this.store.dispatch(startLoadingWaiters());
              }),
              catchError((error) => {
                console.error(error);
                return throwError(error);
              }),
            ),
        ),
      ),
    { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private store: Store<fromApp.AppState>,
  ) {}
}
