import { createAction, props } from '@ngrx/store';
import { Waiter } from './waiter.model';

export const startLoadingWaiters = createAction(
  '[waiters] Start Loading Waiters',
);

export const loadingWaitersSuccess = createAction(
  '[waiters] Loading Waiters Success',
  props<{ waiters: Waiter[] }>(),
);

export const loadingWaitersFail = createAction(
  '[waiters] Loading Waiters Fail',
  props<{ message: string }>(),
);

export const updateWaiter = createAction(
  '[waiters] Update Waiter',
  props<{ waiter: { _id: string; isAvailable: boolean } }>(),
);
