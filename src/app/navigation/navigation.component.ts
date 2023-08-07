import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import { toggleAuto } from '../store/orders/orders.action';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit, OnDestroy {
  private breakpointObserver = inject(BreakpointObserver);
  subscription!: Subscription;
  autoMode!: boolean;

  ngOnInit() {
    this.subscription = this.store.select('orders').subscribe((ordersState) => {
      if (ordersState) {
        this.autoMode = ordersState.isAutoMode;
      }
    });
  }

  constructor(private store: Store<fromApp.AppState>) {}

  autoModeHandler() {
    this.store.dispatch(toggleAuto({ isAutoMode: this.autoMode }));
  }

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay(),
    );

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
