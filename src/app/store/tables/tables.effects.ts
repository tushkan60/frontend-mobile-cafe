import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import { Table } from './table.model';
import { catchError, concatMap, map, switchMap, tap } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import {
  loadingTablesFail,
  loadingTablesSuccess,
  startLoadingTables,
  updateTables,
} from './tables.action';

interface TablesResponse {
  status: string;
  result: number;
  data: {
    tables: Table[];
  };
}

@Injectable()
export class TablesEffects {
  loadingTables = createEffect(() =>
    this.actions$.pipe(
      ofType(startLoadingTables),
      switchMap(() =>
        this.http
          .get<TablesResponse>('http://localhost:3000/api/v1/tables')
          .pipe(
            map((resData) => {
              return loadingTablesSuccess({ tables: resData.data.tables });
            }),
            catchError((error) =>
              of(loadingTablesFail({ message: error.message })),
            ),
          ),
      ),
    ),
  );

  updateTables = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateTables),
        concatMap((action) =>
          this.http
            .patch('http://localhost:3000/api/v1/tables', action.tables)
            .pipe(
              tap(() => {
                this.store.dispatch(startLoadingTables());
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
