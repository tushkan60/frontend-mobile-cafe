import { ActionReducerMap } from '@ngrx/store';
import * as fromDishes from './dishes/dishes.reducer';
import * as fromWaiters from './waiters/waiters.reducer';
import * as fromTables from './tables/tables.reducer';
import * as fromShifts from './shifts/shifts.reducer';
import * as fromOrders from './orders/orders.reducer';

export interface AppState {
  dishes: fromDishes.State;
  waiters: fromWaiters.State;
  tables: fromTables.State;
  shifts: fromShifts.State;
  orders: fromOrders.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  dishes: fromDishes.dishesReducer,
  waiters: fromWaiters.waitersReducer,
  tables: fromTables.tablesReducer,
  shifts: fromShifts.shiftsReducer,
  orders: fromOrders.ordersReducer,
};
