import { Component, OnDestroy, OnInit } from '@angular/core';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Dish } from '../../store/dishes/dish.model';

@Component({
  selector: 'app-list',
  templateUrl: './dishes-list.component.html',
  styleUrls: ['./dishes-list.component.css'],
})
export class DishesListComponent implements OnInit, OnDestroy {
  subscription!: Subscription;
  isLoading = false;
  error: string | null = null;
  dishesList!: Dish[] | null;

  ngOnInit() {
    this.subscription = this.store.select('dishes').subscribe((dishesState) => {
      this.dishesList = dishesState.dishes;
      this.error = dishesState.isError;
      this.isLoading = dishesState.isLoading;
    });
  }

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
