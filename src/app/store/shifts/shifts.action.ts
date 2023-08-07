import { createAction, props } from '@ngrx/store';
import { Shift } from './shift.model';
import { Statistics } from './statistics.model';

export const startLoadingShifts = createAction('[shifts] Start Loading Shifts');

export const loadingShiftsSuccess = createAction(
  '[shifts] Loading Shifts Success',
  props<{ shifts: Shift[] }>(),
);

export const loadingShiftsFail = createAction(
  '[shifts] Loading Shifts Fail',
  props<{ message: string }>(),
);

export const openShift = createAction(
  '[shifts] Open Shifts',
  props<{ waiterId: string; startTime: Date }>(),
);

export const closeShift = createAction(
  '[shifts] Close Shifts',
  props<{ _id: string; waiterId: string; endTime: Date }>(),
);

export const startLoadingStatistics = createAction(
  '[shifts] Start Loading Statistics',
);

export const loadingStatisticsSuccess = createAction(
  '[shifts] Loading Statistics Success',
  props<{ statistics: Statistics }>(),
);

export const loadingStatisticsFail = createAction(
  '[shifts] Loading Statistics Fail',
  props<{ message: string }>(),
);
