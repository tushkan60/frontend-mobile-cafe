import { Order } from './order.model';
import { createReducer, on } from '@ngrx/store';
import {
  closeOrder,
  loadingOrdersFail,
  loadingOrdersSuccess,
  createOrder,
  startLoadingOrders,
  toggleAuto,
} from './orders.action';

export interface State {
  orders: Order[] | null;
  isLoading: boolean;
  isError: string | null;
  isAutoMode: boolean;
}

const initialState: State = {
  orders: null,
  isLoading: false,
  isError: null,
  isAutoMode: false,
};

export const ordersReducer = createReducer(
  initialState,
  on(startLoadingOrders, (state) => ({
    ...state,
    isError: null,
    isLoading: true,
  })),
  on(loadingOrdersSuccess, (state, action) => ({
    ...state,
    orders: action.orders,
    isError: null,
    isLoading: false,
  })),
  on(loadingOrdersFail, (state, action) => ({
    ...state,
    isError: action.message,
    isLoading: false,
  })),
  on(createOrder, (state, action) => ({
    ...state,
  })),
  on(closeOrder, (state, action) => ({
    ...state,
  })),
  on(toggleAuto, (state, action) => ({
    ...state,
    isAutoMode: !action.isAutoMode,
  })),
);
