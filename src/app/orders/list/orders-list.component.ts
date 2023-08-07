import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { Table } from '../../store/tables/table.model';
import { Order } from '../../store/orders/order.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css'],
})
export class OrdersListComponent implements OnInit, OnDestroy {
  waitersSubscription!: Subscription;
  tablesSubscription!: Subscription;
  ordersSubscription!: Subscription;
  navigationTimeout: any;
  availableWaiters: { _id: string | null; name: string | null }[] = [];
  waiterNameList: { _id: string | null; name: string | null }[] = [];
  ordersList: Order[] = [];
  tablesList: Table[] | null = [];
  availableTables: Table[] | null = [];

  constructor(
    private router: Router,
    private store: Store<fromApp.AppState>,
  ) {}

  ngOnInit() {
    this.waitersSubscription = this.store
      .select('waiters')
      .subscribe((waitersState) => {
        this.availableWaiters = [];
        if (waitersState.waiters) {
          for (let waiter of waitersState.waiters) {
            this.waiterNameList?.push({ _id: waiter._id!, name: waiter.name! });
            if (waiter.inShift && waiter.isAvailable) {
              this.availableWaiters?.push({
                _id: waiter._id!,
                name: waiter.name!,
              });
            }
          }
        }
      });

    this.ordersSubscription = this.store
      .select('orders')
      .subscribe((ordersState) => {
        this.ordersList = [];
        if (ordersState.orders) {
          ordersState.orders.forEach((orders) => {
            const { createdAt } = orders;

            const morning = new Date();
            morning.setHours(0, 0, 0, 0);

            const night = new Date();
            night.setHours(23, 59, 59, 999);

            const date = createdAt ? new Date(createdAt) : null;

            if (date && morning < date && date < night) {
              this.ordersList?.push(orders);
            }
          });
        }
      });

    this.tablesSubscription = this.store
      .select('tables')
      .subscribe((tablesState) => {
        this.tablesList = tablesState.tables;
        if (this.tablesList) {
          for (let table of this.tablesList) {
            if (!table.isOccupied) {
              this.availableTables?.push(table);
            }
          }
        }
      });
  }

  getWaiterName(waiterId: string | null): string {
    const waiter = this.waiterNameList.find(
      (waiter) => waiter._id === waiterId,
    );
    return waiter ? waiter.name || 'Нет данных' : 'Нет данных';
  }

  getTableNumber(tableId: string | null): number {
    const table = this.tablesList?.find((table) => table._id === tableId);
    return table ? table.number || 0 : 0;
  }

  ngOnDestroy() {
    if (this.waitersSubscription) {
      this.waitersSubscription.unsubscribe();
    }
    if (this.tablesSubscription) {
      this.tablesSubscription.unsubscribe();
    }
    if (this.ordersSubscription) {
      this.ordersSubscription.unsubscribe();
    }
    if (this.navigationTimeout) {
      clearTimeout(this.navigationTimeout);
    }
  }
}
