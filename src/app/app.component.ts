import { Component, OnInit } from '@angular/core';
import * as fromApp from '../app/store/app.reducer';
import { Store } from '@ngrx/store';
import { startLoadingDishes } from './store/dishes/dishes.action';
import { startLoadingShifts } from './store/shifts/shifts.action';
import { startLoadingWaiters } from './store/waiters/waiters.action';
import { startLoadingTables } from './store/tables/tables.action';
import { startLoadingOrders } from './store/orders/orders.action';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  ngOnInit() {
    this.store.dispatch(startLoadingShifts());
    this.store.dispatch(startLoadingWaiters());
    this.store.dispatch(startLoadingTables());
    this.store.dispatch(startLoadingDishes());
    this.store.dispatch(startLoadingOrders());
  }
  constructor(private store: Store<fromApp.AppState>) {}
}
