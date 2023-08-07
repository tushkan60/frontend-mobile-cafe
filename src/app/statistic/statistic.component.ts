import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import { Subscription } from 'rxjs';
import { Statistics } from '../store/shifts/statistics.model';
import { startLoadingStatistics } from '../store/shifts/shifts.action';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css'],
})
export class StatisticComponent implements OnInit, OnDestroy {
  statisticsSubscription!: Subscription;
  waitersSubscription!: Subscription;
  dishesSubscription!: Subscription;
  statistics!: Statistics;
  waiters: { _id: string | null; name: string | null }[] = [];
  dishes: { _id: string | null; name: string | null }[] = [];

  ngOnInit() {
    this.statisticsSubscription = this.store
      .select('shifts')
      .subscribe((statisticsState) => {
        if (statisticsState.statistics) {
          this.statistics = statisticsState.statistics;
        }
      });
    this.waitersSubscription = this.store
      .select('waiters')
      .subscribe((waitersState) => {
        if (waitersState.waiters) {
          for (let waiter of waitersState.waiters) {
            this.waiters.push({ _id: waiter._id, name: waiter.name });
          }
        }
      });
    this.dishesSubscription = this.store
      .select('dishes')
      .subscribe((dishesState) => {
        if (dishesState.dishes) {
          for (let dish of dishesState.dishes) {
            this.dishes.push({ _id: dish._id, name: dish.name });
          }
        }
      });
  }

  getWaiterName(waiterId: string | null): string {
    const waiter = this.waiters.find((waiter) => waiter._id === waiterId);
    return waiter ? waiter.name || 'Нет данных' : 'Нет данных';
  }

  getDishName(dishId: string | null): string {
    const dish = this.dishes.find((dish) => dish._id === dishId);
    return dish ? dish.name || 'Нет данных' : 'Нет данных';
  }

  statisticsHandler() {
    this.store.dispatch(startLoadingStatistics());
  }

  constructor(
    private store: Store<fromApp.AppState>,
    private http: HttpClient,
  ) {}

  downloadFile() {
    const apiUrl = 'http://localhost:3000/api/v1/shifts/statistics';
    this.http.get(apiUrl, { responseType: 'blob' }).subscribe((response) => {
      this.saveFile(response);
    });
  }

  private saveFile(blobData: Blob) {
    const blob = new Blob([blobData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'statistics.json';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  ngOnDestroy() {
    if (this.statisticsSubscription) {
      this.statisticsSubscription.unsubscribe();
    }
    if (this.dishesSubscription) {
      this.dishesSubscription.unsubscribe();
    }
    if (this.waitersSubscription) {
      this.waitersSubscription.unsubscribe();
    }
  }
}
