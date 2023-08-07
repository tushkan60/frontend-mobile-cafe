import { createReducer, on } from '@ngrx/store';
import {
  createDish,
  loadingDishesFail,
  loadingDishesSuccess,
  startLoadingDishes,
  updateDish,
} from './dishes.action';
import { Dish } from './dish.model';

export interface State {
  dishes: Dish[] | null;
  isLoading: boolean;
  isError: string | null;
}

const initialState: State = { dishes: null, isLoading: false, isError: null };

export const dishesReducer = createReducer(
  initialState,
  on(startLoadingDishes, (state) => ({
    ...state,
    isError: null,
    isLoading: true,
  })),
  on(loadingDishesSuccess, (state, action) => ({
    ...state,
    dishes: action.dishes,
    isError: null,
    isLoading: false,
  })),
  on(loadingDishesFail, (state, action) => ({
    ...state,
    isError: action.message,
    isLoading: false,
  })),
  on(updateDish, (state, action) => ({ ...state })),
  on(createDish, (state, action) => ({ ...state })),
);
