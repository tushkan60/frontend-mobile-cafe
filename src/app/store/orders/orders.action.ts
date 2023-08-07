import { createAction, props } from '@ngrx/store';
import { Order } from './order.model';

export const startLoadingOrders = createAction('[orders] Start Loading Orders');

export const loadingOrdersSuccess = createAction(
  '[orders] Loading Orders Success',
  props<{ orders: Order[] }>(),
);

export const loadingOrdersFail = createAction(
  '[orders] Loading Orders Fail',
  props<{ message: string }>(),
);

export const createOrder = createAction(
  '[orders] Create Order',
  props<{
    table: string;
    dishes: { dish: string; quantity: number }[];
    waiterId: string;
    createdAt: Date;
  }>(),
);

export const closeOrder = createAction(
  '[orders] Close Order',
  props<{ _id: string; isPaid: boolean; closedAt: Date }>(),
);

export const toggleAuto = createAction(
  '[orders] Toggle Auto',
  props<{ isAutoMode: boolean }>(),
);
