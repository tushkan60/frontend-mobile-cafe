import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import { Order } from './order.model';
import {
  catchError,
  concatMap,
  delay,
  ignoreElements,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import {
  loadingOrdersFail,
  loadingOrdersSuccess,
  startLoadingOrders,
  createOrder,
  closeOrder,
} from './orders.action';
import { startLoadingWaiters, updateWaiter } from '../waiters/waiters.action';
import { startLoadingTables } from '../tables/tables.action';
import { startLoadingShifts } from '../shifts/shifts.action';

interface OrdersResponse {
  status: string;
  result: number;
  data: {
    orders: Order[];
  };
}

interface OrderResponse {
  status: string;
  result: number;
  data: {
    order: Order;
  };
}

function checkPayment(orders: Order[], processedOrderId: string) {
  if (orders) {
    for (let checkedOrder of orders) {
      if (
        checkedOrder.isPaid === true &&
        checkedOrder._id === processedOrderId
      ) {
        console.log('Заказ уже оплачен');
        throw throwError('Заказ уже оплачен');
      }
    }
    console.log('не оплачено');
  }
}

@Injectable()
export class OrdersEffects {
  loadingOrders = createEffect(() =>
    this.actions$.pipe(
      ofType(startLoadingOrders),
      switchMap(() =>
        this.http
          .get<OrdersResponse>('http://localhost:3000/api/v1/orders')
          .pipe(
            map((resData) => {
              return loadingOrdersSuccess({ orders: resData.data.orders });
            }),
            catchError((error) =>
              of(loadingOrdersFail({ message: error.message })),
            ),
          ),
      ),
    ),
  );

  createOrder = createEffect(
    () =>
      this.actions$
        .pipe(
          ofType(createOrder),
          concatMap((action) =>
            this.http
              .post<OrderResponse>('http://localhost:3000/api/v1/orders', {
                table: action.table,
                dishes: action.dishes,
                waiterId: action.waiterId,
                createdAt: action.createdAt,
              })
              .pipe(
                tap((response) => {
                  const order = response.data.order;
                  this.store.dispatch(startLoadingOrders());
                  this.store.dispatch(startLoadingWaiters());
                  this.store.dispatch(startLoadingTables());
                  this.store.dispatch(startLoadingShifts());
                  if (order.waiterId && order._id) {
                    console.log(
                      `Официант ${order.waiterId} относит заказ на кухню`,
                    );
                    of(order.waiterId)
                      .pipe(delay(2 * 60 * 1000))
                      // .pipe(delay(10 * 1000))
                      .pipe(
                        withLatestFrom(this.store.select('orders')),
                        concatMap((waiterAndOrdersState) => {
                          if (waiterAndOrdersState[1].orders && order._id) {
                            checkPayment(
                              waiterAndOrdersState[1].orders,
                              order._id,
                            );
                          }
                          console.log(
                            `Официант ${waiterAndOrdersState[0]} вернулся с кухни`,
                          );
                          this.store.dispatch(
                            updateWaiter({
                              waiter: {
                                _id: waiterAndOrdersState[0],
                                isAvailable: true,
                              },
                            }),
                          );
                          return of(waiterAndOrdersState[0]);
                        }),
                      )
                      .pipe(delay(6 * 60 * 1000))
                      // .pipe(delay(10 * 1000))
                      .pipe(
                        withLatestFrom(this.store.select('orders')),
                        concatMap((waiterAndOrdersState) => {
                          if (waiterAndOrdersState[1].orders && order._id) {
                            checkPayment(
                              waiterAndOrdersState[1].orders,
                              order._id,
                            );
                          }
                          this.store.dispatch(
                            updateWaiter({
                              waiter: {
                                _id: waiterAndOrdersState[0],
                                isAvailable: false,
                              },
                            }),
                          );
                          console.log(
                            `Официант ${waiterAndOrdersState[0]} ушел за заказом`,
                          );
                          return of(waiterAndOrdersState[0]);
                        }),
                      )
                      .pipe(delay(60 * 1000))
                      // .pipe(delay(10 * 1000))
                      .pipe(
                        withLatestFrom(this.store.select('orders')),
                        concatMap((waiterAndOrdersState) => {
                          if (waiterAndOrdersState[1].orders && order._id) {
                            checkPayment(
                              waiterAndOrdersState[1].orders,
                              order._id,
                            );
                          }
                          this.store.dispatch(
                            updateWaiter({
                              waiter: {
                                _id: waiterAndOrdersState[0],
                                isAvailable: true,
                              },
                            }),
                          );
                          console.log(
                            `Официант ${waiterAndOrdersState[0]} отдал заказ`,
                          );
                          return of(waiterAndOrdersState[0]);
                        }),
                      )
                      .pipe(delay(10 * 60 * 1000))
                      // .pipe(delay(10 * 1000))
                      .pipe(
                        withLatestFrom(this.store.select('orders')),
                        concatMap((waiterAndOrdersState) => {
                          if (waiterAndOrdersState[1].orders && order._id) {
                            checkPayment(
                              waiterAndOrdersState[1].orders,
                              order._id,
                            );
                          }
                          this.store.dispatch(
                            updateWaiter({
                              waiter: {
                                _id: waiterAndOrdersState[0],
                                isAvailable: false,
                              },
                            }),
                          );
                          console.log(
                            `Официант ${waiterAndOrdersState[0]} принимает оплату `,
                          );
                          return of(waiterAndOrdersState[0]);
                        }),
                      )
                      .pipe(
                        delay(2 * 60 * 1000),
                        // delay(10 * 1000),
                        withLatestFrom(this.store.select('orders')),
                      )
                      .subscribe((waiterAndOrdersState) => {
                        if (waiterAndOrdersState[1].orders && order._id) {
                          checkPayment(
                            waiterAndOrdersState[1].orders,
                            order._id,
                          );
                        }
                        this.store.dispatch(
                          closeOrder({
                            isPaid: true,
                            closedAt: new Date(),
                            _id: order._id!,
                          }),
                        );
                        console.log(
                          `Официант ${waiterAndOrdersState[0]} закрыл заказ`,
                        );
                        this.store.dispatch(
                          updateWaiter({
                            waiter: {
                              _id: waiterAndOrdersState[0],
                              isAvailable: true,
                            },
                          }),
                        );
                      });
                  }
                }),
                catchError((error) => {
                  console.error(error);
                  return throwError(error);
                }),
              ),
          ),
        )
        .pipe(ignoreElements()),
    { dispatch: false },
  );

  closeOrder = createEffect(
    () =>
      this.actions$.pipe(
        ofType(closeOrder),
        concatMap((action) =>
          this.http
            .patch('http://localhost:3000/api/v1/orders/' + action._id, {
              isPaid: action.isPaid,
              closedAt: action.closedAt,
            })
            .pipe(
              tap(() => {
                this.store.dispatch(startLoadingOrders());
                this.store.dispatch(startLoadingWaiters());
                this.store.dispatch(startLoadingTables());
                this.store.dispatch(startLoadingShifts());
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
