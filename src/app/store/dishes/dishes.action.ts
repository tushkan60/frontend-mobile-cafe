import { createAction, props } from '@ngrx/store';
import { Dish } from './dish.model';

export const startLoadingDishes = createAction('[dishes] Start Loading Dishes');

export const loadingDishesSuccess = createAction(
  '[dishes] Loading Dishes Success',
  props<{ dishes: Dish[] }>(),
);

export const loadingDishesFail = createAction(
  '[dishes] Loading Dishes Fail',
  props<{ message: string }>(),
);

export const updateDish = createAction(
  '[dishes] Update Dish',
  props<{ dish: Dish }>(),
);

export const createDish = createAction(
  '[dishes] Create Dish',
  props<{ dish: { name: string; price: number } }>(),
);
