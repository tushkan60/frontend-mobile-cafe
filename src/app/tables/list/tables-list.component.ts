import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Table } from '../../store/tables/table.model';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { updateTables } from '../../store/tables/tables.action';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-list',
  templateUrl: './tables-list.component.html',
  styleUrls: ['./tables-list.component.css'],
})
export class TablesListComponent implements OnInit, OnDestroy {
  tablesForm!: FormGroup;
  isEditMode: boolean = false;
  tablesSubscription!: Subscription;
  waitersSubscription!: Subscription;
  isLoading = false;
  error: string | null = null;
  tablesList!: Table[] | null;
  waitersList: { _id: string | null; name: string | null }[] = [];
  constructor(private store: Store<fromApp.AppState>) {}

  getWaiterName(waiterId: string | null): string {
    const waiter = this.waitersList.find((waiter) => waiter._id === waiterId);
    return waiter ? waiter.name || 'Нет данных' : 'Нет данных';
  }

  ngOnInit() {
    this.initForm();
    this.tablesSubscription = this.store
      .select('tables')
      .subscribe((tablesState) => {
        this.tablesList = tablesState.tables;
        this.error = tablesState.isError;
        this.isLoading = tablesState.isLoading;

        if (tablesState.tables) {
          const tablesFormArray = this.tablesForm.get('tables') as FormArray;
          tablesFormArray.clear();
          for (let table of tablesState.tables) {
            tablesFormArray.push(
              new FormGroup({
                _id: new FormControl(table._id),
                defaultWaiter: new FormControl(table.defaultWaiter),
                number: new FormControl(table.number),
                isOccupied: new FormControl(table.isOccupied),
              }),
            );
          }
        }
      });

    this.waitersSubscription = this.store
      .select('waiters')
      .subscribe((waitersState) => {
        if (waitersState.waiters) {
          for (let waiter of waitersState.waiters) {
            this.waitersList?.push({ _id: waiter._id!, name: waiter.name! });
          }
        }
      });
  }

  get controls() {
    return (this.tablesForm.get('tables') as FormArray).controls;
  }

  onSubmit() {
    this.store.dispatch(updateTables(this.tablesForm.value));
    this.isEditMode = false;
  }

  private initForm() {
    let tablesFormArray = new FormArray([]);
    this.tablesForm = new FormGroup({ tables: tablesFormArray });
  }

  ngOnDestroy() {
    if (this.tablesSubscription) {
      this.tablesSubscription.unsubscribe();
    }
    if (this.waitersSubscription) {
      this.waitersSubscription.unsubscribe();
    }
  }
}
