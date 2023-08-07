import { Table } from './table.model';
import { createReducer, on } from '@ngrx/store';
import {
  loadingTablesFail,
  loadingTablesSuccess,
  startLoadingTables,
  updateTables,
} from './tables.action';
import { createOrder } from '../orders/orders.action';

export interface State {
  tables: Table[] | null;
  isLoading: boolean;
  isError: string | null;
}

const initialState: State = { tables: null, isLoading: false, isError: null };

export const tablesReducer = createReducer(
  initialState,
  on(startLoadingTables, (state) => ({
    ...state,
    isError: null,
    isLoading: true,
  })),
  on(loadingTablesSuccess, (state, action) => ({
    ...state,
    tables: action.tables,
    isError: null,
    isLoading: false,
  })),
  on(loadingTablesFail, (state, action) => ({
    ...state,
    isError: action.message,
    isLoading: false,
  })),
  on(updateTables, (state, action) => ({
    ...state,
  })),
  on(createOrder, (state, action) => {
    let updatedTables: Table[] = [];
    if (state.tables) {
      updatedTables = state.tables?.map((table) => {
        if (table._id === action.table) {
          return { ...table, isOccupied: true };
        }
        return table;
      });
    }
    return { ...state, tables: updatedTables };
  }),
);
