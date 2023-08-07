import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import * as fromApp from '../app.reducer';
import { Store } from '@ngrx/store';
import { catchError, concatMap, map, switchMap, tap } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import {
  startLoadingDishes,
  loadingDishesSuccess,
  loadingDishesFail,
  updateDish,
  createDish,
} from './dishes.action';
import { Dish } from './dish.model';
import { Router } from '@angular/router';

interface DishesResponse {
  status: string;
  result: number;
  data: {
    dishes: Dish[];
  };
}

@Injectable()
export class DishesEffects {
  loadingDishes = createEffect(() =>
    this.actions$.pipe(
      ofType(startLoadingDishes),
      switchMap(() =>
        this.http
          .get<DishesResponse>('http://localhost:3000/api/v1/dishes')
          .pipe(
            map((resData) => {
              return loadingDishesSuccess({ dishes: resData.data.dishes });
            }),
            catchError((error) =>
              of(loadingDishesFail({ message: error.message })),
            ),
          ),
      ),
    ),
  );

  updateDish = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateDish),
        switchMap((action) =>
          this.http
            .patch<any>(
              'http://localhost:3000/api/v1/dishes/' + action.dish._id,
              {
                name: action.dish.name,
                price: action.dish.price,
              },
            )
            .pipe(
              tap(() => {
                this.store.dispatch(startLoadingDishes()); // Dispatching the loadingDishes action
                this.router.navigate(['/dishes']);
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

  createDish = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createDish),
        concatMap((action) =>
          this.http
            .post('http://localhost:3000/api/v1/dishes/', {
              name: action.dish.name,
              price: action.dish.price,
            })
            .pipe(
              tap(() => {
                this.store.dispatch(startLoadingDishes());
                this.router.navigate(['/dishes']);
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
