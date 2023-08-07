import { Waiter } from './waiter.model';
import { createReducer, on } from '@ngrx/store';
import {
  loadingWaitersFail,
  loadingWaitersSuccess,
  startLoadingWaiters,
  updateWaiter,
} from './waiters.action';
import { createOrder } from '../orders/orders.action';

export interface State {
  waiters: Waiter[] | null;
  isLoading: boolean;
  isError: string | null;
}

const initialState: State = { waiters: null, isLoading: false, isError: null };

export const waitersReducer = createReducer(
  initialState,
  on(startLoadingWaiters, (state) => ({
    ...state,
    isError: null,
    isLoading: true,
  })),
  on(loadingWaitersSuccess, (state, action) => ({
    ...state,
    waiters: action.waiters,
    isError: null,
    isLoading: false,
  })),
  on(loadingWaitersFail, (state, action) => ({
    ...state,
    isError: action.message,
    isLoading: false,
  })),
  on(updateWaiter, (state, action) => ({
    ...state,
  })),
  on(createOrder, (state, action) => {
    let updatedWaiters: Waiter[] = [];
    if (state.waiters) {
      updatedWaiters = state.waiters?.map((waiter) => {
        if (waiter._id === action.waiterId) {
          return { ...waiter, isAvailable: false };
        }
        return waiter;
      });
    }
    return { ...state, waiters: updatedWaiters };
  }),
);
