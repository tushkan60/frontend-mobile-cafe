import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import { Shift } from './shift.model';
import { catchError, concatMap, map, switchMap, tap } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import {
  loadingShiftsFail,
  loadingShiftsSuccess,
  startLoadingShifts,
  openShift,
  closeShift,
  startLoadingStatistics,
  loadingStatisticsSuccess,
  loadingStatisticsFail,
} from './shifts.action';
import { startLoadingWaiters } from '../waiters/waiters.action';
import { Statistics } from './statistics.model';

interface ShiftsResponse {
  status: string;
  result: number;
  data: {
    shifts: Shift[];
  };
}

interface StatisticsResponse {
  status: string;
  result: number;
  data: Statistics;
}

@Injectable()
export class ShiftsEffects {
  loadingShifts = createEffect(() =>
    this.actions$.pipe(
      ofType(startLoadingShifts),
      switchMap(() =>
        this.http
          .get<ShiftsResponse>('http://localhost:3000/api/v1/shifts')
          .pipe(
            map((resData) => {
              return loadingShiftsSuccess({ shifts: resData.data.shifts });
            }),
            catchError((error) =>
              of(loadingShiftsFail({ message: error.message })),
            ),
          ),
      ),
    ),
  );

  openShift = createEffect(
    () =>
      this.actions$.pipe(
        ofType(openShift),
        concatMap((action) =>
          this.http
            .post('http://localhost:3000/api/v1/shifts', {
              waiterId: action.waiterId,
              startTime: action.startTime,
            })
            .pipe(
              tap(() => {
                this.store.dispatch(startLoadingShifts());
                this.store.dispatch(startLoadingWaiters());
                this.router.navigate(['/waiters']);
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

  closeShift = createEffect(
    () =>
      this.actions$.pipe(
        ofType(closeShift),
        concatMap((action) =>
          this.http
            .patch('http://localhost:3000/api/v1/shifts/' + action._id, {
              waiterId: action.waiterId,
              endTime: action.endTime,
            })
            .pipe(
              tap(() => {
                this.store.dispatch(startLoadingShifts());
                this.store.dispatch(startLoadingWaiters());
                this.router.navigate(['/waiters']);
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

  loadingStatistics = createEffect(() =>
    this.actions$.pipe(
      ofType(startLoadingStatistics),
      switchMap(() =>
        this.http
          .get<StatisticsResponse>(
            'http://localhost:3000/api/v1/shifts/statistics',
          )
          .pipe(
            map((resData) => {
              return loadingStatisticsSuccess({
                statistics: resData.data,
              });
            }),
            catchError((error) =>
              of(loadingStatisticsFail({ message: error.message })),
            ),
          ),
      ),
    ),
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private store: Store<fromApp.AppState>,
  ) {}
}
