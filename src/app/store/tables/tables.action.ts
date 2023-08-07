import { createAction, props } from '@ngrx/store';
import { Table } from './table.model';

export const startLoadingTables = createAction('[tables] Start Loading Tables');

export const loadingTablesSuccess = createAction(
  '[tables] Loading Tables Success',
  props<{ tables: Table[] }>(),
);

export const loadingTablesFail = createAction(
  '[tables] Loading Tables Fail',
  props<{ message: string }>(),
);

export const updateTables = createAction(
  '[tables] Update Tables',
  props<{ tables: { _id: string; defaultWaiter: string }[] }>(),
);
