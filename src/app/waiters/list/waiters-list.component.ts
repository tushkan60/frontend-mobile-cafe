import { Component, OnDestroy, OnInit } from '@angular/core';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Waiter } from '../../store/waiters/waiter.model';

@Component({
  selector: 'app-list',
  templateUrl: './waiters-list.component.html',
  styleUrls: ['./waiters-list.component.css'],
})
export class WaitersListComponent implements OnInit, OnDestroy {
  subscription!: Subscription;
  isLoading = false;
  error: string | null = null;
  waitersList!: Waiter[] | null;

  constructor(private store: Store<fromApp.AppState>) {}
  ngOnInit() {
    this.subscription = this.store
      .select('waiters')
      .subscribe((waitersState) => {
        this.waitersList = waitersState.waiters;
        this.error = waitersState.isError;
        this.isLoading = waitersState.isLoading;
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
