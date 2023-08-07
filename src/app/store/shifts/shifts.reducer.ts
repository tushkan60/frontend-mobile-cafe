import { Shift } from './shift.model';
import { createReducer, on } from '@ngrx/store';
import {
  loadingShiftsFail,
  loadingShiftsSuccess,
  startLoadingShifts,
  openShift,
  closeShift,
  startLoadingStatistics,
  loadingStatisticsSuccess,
  loadingStatisticsFail,
} from './shifts.action';
import { Statistics } from './statistics.model';

export interface State {
  shifts: Shift[] | null;
  isLoading: boolean;
  isError: string | null;
  statistics: Statistics | null;
}

const initialState: State = {
  shifts: null,
  isLoading: false,
  isError: null,
  statistics: null,
};

export const shiftsReducer = createReducer(
  initialState,
  on(startLoadingShifts, (state) => ({
    ...state,
    isError: null,
    isLoading: true,
  })),
  on(loadingShiftsSuccess, (state, action) => ({
    ...state,
    shifts: action.shifts,
    isError: null,
    isLoading: false,
  })),
  on(loadingShiftsFail, (state, action) => ({
    ...state,
    isError: action.message,
    isLoading: false,
  })),
  on(openShift, (state, action) => ({
    ...state,
  })),
  on(closeShift, (state, action) => ({
    ...state,
  })),
  on(startLoadingStatistics, (state) => ({
    ...state,
    isError: null,
    isLoading: true,
  })),
  on(loadingStatisticsSuccess, (state, action) => ({
    ...state,
    statistics: action.statistics,
    isError: null,
    isLoading: false,
  })),
  on(loadingStatisticsFail, (state, action) => ({
    ...state,
    isError: action.message,
    isLoading: false,
  })),
);
