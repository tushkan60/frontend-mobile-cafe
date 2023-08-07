import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { closeShift, openShift } from '../../store/shifts/shifts.action';
import { Shift } from '../../store/shifts/shift.model';

@Component({
  selector: 'app-detail',
  templateUrl: './waiter-detail.component.html',
  styleUrls: ['./waiter-detail.component.css'],
})
export class WaiterDetailComponent implements OnInit, OnDestroy {
  waitersSubscription!: Subscription;
  shiftsSubscription!: Subscription;
  tablesSubscription!: Subscription;
  id!: string | null;
  waiter: {
    name: string | null;
    efficiency: number | null;
    isAvailable: boolean | null;
    inShift: boolean | null;
    shifts: string[] | null;
    openOrders: number | null;
  } = {
    name: null,
    efficiency: null,
    isAvailable: null,
    inShift: null,
    shifts: null,
    openOrders: null,
  };
  tables: {
    _id: string | null;
    number: number | null;
    isOccupied: boolean | null;
  }[] = [];
  shifts: Shift[] = [];
  total: {
    ordersQuantity: number | null;
    ordersRevenue: number | null;
    ordersTips: number | null;
  } = { ordersQuantity: 0, ordersRevenue: 0, ordersTips: 0 };

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.id = this.id.substring(1);
    }

    this.waitersSubscription = this.store
      .select('waiters')
      .subscribe((waitersState) => {
        const waiter = waitersState.waiters?.find(
          (waiter) => waiter._id === this.id,
        );
        if (waiter) {
          this.waiter = waiter;
        }
      });

    this.tablesSubscription = this.store
      .select('tables')
      .subscribe((tablesState) => {
        const tables = tablesState.tables?.filter(
          (table) => table.defaultWaiter === this.id,
        );
        if (tables) {
          this.tables = tables;
        }
      });

    this.shiftsSubscription = this.store
      .select('shifts')
      .subscribe((shiftsState) => {
        const shifts = shiftsState.shifts?.filter(
          (shift) => shift.waiterId === this.id,
        );
        if (shifts) {
          this.shifts = shifts;
          this.total = this.calculateTotalOrders(this.shifts);
        }
      });
  }

  onStart() {
    if (this.id) {
      this.store.dispatch(
        openShift({ waiterId: this.id, startTime: new Date() }),
      );
    }
  }

  onClose() {
    if (this.id && this.waiter.inShift && this.waiter.openOrders === 0) {
      const openShift = this.shifts?.find((shift) => {
        return shift.isOpen === true;
      });
      if (openShift) {
        const openShiftId = openShift?._id || 'empty';
        this.store.dispatch(
          closeShift({
            waiterId: this.id,
            endTime: new Date(),
            _id: openShiftId,
          }),
        );
      }
    }
  }

  constructor(
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>,
  ) {}

  calculateTotalOrders(shifts: Shift[]) {
    return shifts.reduce(
      (totalObj, shift) => {
        totalObj.ordersQuantity += shift.totalOrders || 0;
        totalObj.ordersRevenue += shift.totalRevenue || 0;
        totalObj.ordersTips += shift.totalTips || 0;
        return totalObj;
      },
      { ordersQuantity: 0, ordersRevenue: 0, ordersTips: 0 },
    );
  }

  ngOnDestroy() {
    if (this.waitersSubscription) {
      this.waitersSubscription.unsubscribe();
    }
    if (this.shiftsSubscription) {
      this.shiftsSubscription.unsubscribe();
    }
    if (this.tablesSubscription) {
      this.tablesSubscription.unsubscribe();
    }
  }
}
