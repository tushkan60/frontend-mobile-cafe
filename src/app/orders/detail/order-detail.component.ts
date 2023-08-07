import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { Subscription } from 'rxjs';
import { Table } from '../../store/tables/table.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { closeOrder, createOrder } from '../../store/orders/orders.action';
import { Order } from '../../store/orders/order.model';

type Dish = { dish: string; quantity: number };
@Component({
  selector: 'app-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css'],
})
export class OrderDetailComponent implements OnInit, OnDestroy {
  orderForm!: FormGroup;
  tablesSubscription!: Subscription;
  waitersSubscription!: Subscription;
  dishesSubscription!: Subscription;
  ordersSubscription!: Subscription;
  startTimeout: any;
  editMode: boolean = false;
  tablesList: Table[] | null = [];
  waitersList: {
    _id: string | null;
    name: string | null;
    isAvailable: boolean | null;
    inShift: boolean | null;
  }[] = [];
  dishesList: {
    quantity: number | null;
    dish: string | null;
    name: string | null;
    price: number | null;
  }[] = [];
  id!: string | null;
  order!: Order;
  payed: boolean = false;
  autoMode!: boolean;

  ngOnInit() {
    this.orderForm = new FormGroup({
      table: new FormControl(null),
      waiter: new FormControl(null),
      dishes: new FormArray([]),
      tipsAmount: new FormControl({
        value: null,
        disabled: true,
      }),
    });
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id && this.id !== ':new') {
      this.id = this.id.substring(1);
      this.editMode = true;
    }

    this.tablesSubscription = this.store
      .select('tables')
      .subscribe((tablesState) => {
        if (tablesState.tables) {
          this.tablesList = [];
          for (let table of tablesState.tables) {
            if (!this.editMode) {
              if (!table.isOccupied) {
                this.tablesList?.push(table);
              }
            } else {
              this.tablesList?.push(table);
            }
          }
        }
      });

    this.waitersSubscription = this.store
      .select('waiters')
      .subscribe((waitersState) => {
        if (waitersState.waiters) {
          this.waitersList = [];
          for (let waiter of waitersState.waiters) {
            if (waiter.inShift && waiter.isAvailable) {
              this.waitersList?.push({
                inShift: waiter.inShift,
                isAvailable: waiter.isAvailable,
                _id: waiter._id!,
                name: waiter.name!,
              });
            }
          }
        }
      });
    this.setRandomWaiter();

    this.dishesSubscription = this.store
      .select('dishes')
      .subscribe((dishesState) => {
        if (dishesState && dishesState.dishes) {
          this.dishesList = dishesState.dishes.map((dishInList) => ({
            dish: dishInList._id,
            name: dishInList.name,
            quantity: null,
            price: dishInList.price,
          }));
        }
      });
    this.onAddRandomDish();

    this.ordersSubscription = this.store
      .select('orders')
      .subscribe((ordersState) => {
        if (ordersState.orders) {
          this.autoMode = ordersState.isAutoMode;
          const order = ordersState.orders?.find(
            (order) => order._id === this.id,
          );
          if (order) {
            this.order = order;
            this.payed = order.isPaid as boolean;
            const dishesFormArray = this.orderForm.get('dishes') as FormArray;
            dishesFormArray.clear();
            for (let dish of order.dishes) {
              dishesFormArray.push(
                new FormGroup({
                  dish: new FormControl({ value: dish.dish, disabled: true }),
                  quantity: new FormControl({
                    value: dish.quantity,
                    disabled: true,
                  }),
                }),
              );
            }
            this.orderForm = new FormGroup({
              table: new FormControl({ value: order.table, disabled: true }),
              waiter: new FormControl({
                value: order.waiterId,
                disabled: true,
              }),
              tipsAmount: new FormControl({
                value: this.order.tipsAmount,
                disabled: true,
              }),
              dishes: dishesFormArray,
            });
          }
        }
      });
    if (this.editMode) {
    } else {
      // this.onCreate();
      if (this.autoMode) {
        this.onTryCreate();
      }
    }
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>,
  ) {}

  getWaiterName(tableId: any): string {
    const selectedTable = this.tablesList?.find(
      (table) => table._id === tableId,
    );
    if (selectedTable && selectedTable.defaultWaiter) {
      const selectedWaiter = this.waitersList.find(
        (waiter) => waiter._id === selectedTable.defaultWaiter,
      );

      if (selectedWaiter && selectedWaiter.name) {
        return `Обслуживающий официант: ${selectedWaiter.name}`;
      }
    }
    return 'Обслуживающий официант не на смене или занят';
  }

  setRandomWaiter() {
    const randomTableIndex = Math.floor(
      Math.random() * (this.tablesList?.length || 0),
    );
    const randomTable = this.tablesList![randomTableIndex];
    this.orderForm.get('table')?.setValue(randomTable?._id || null);

    if (randomTable && randomTable.defaultWaiter) {
      const matchingWaiter = this.waitersList.find(
        (waiter) => waiter._id === randomTable.defaultWaiter,
      );
      if (matchingWaiter) {
        this.orderForm.get('waiter')?.setValue(matchingWaiter._id || null);
      } else {
        const currentIndex = this.waitersList.findIndex(
          (waiter) => waiter._id === null,
        );
        const nextIndex = currentIndex !== -1 ? currentIndex : 0;
        const nextWaiter =
          this.waitersList[nextIndex % this.waitersList.length];
        this.orderForm.get('waiter')?.setValue(nextWaiter?._id || null);
      }
    }
  }

  getRandomDish(array: any[]) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }

  onAddDish() {
    const dishesFormArray = this.orderForm.get('dishes') as FormArray;
    dishesFormArray.push(
      new FormGroup({
        dish: new FormControl(this.dishesList[0].dish),
        quantity: new FormControl(1),
      }),
    );
  }

  onAddRandomDish() {
    const randomDishObject = this.getRandomDish(this.dishesList);
    const randomDishId = randomDishObject.dish;
    const dishesFormArray = this.orderForm.get('dishes') as FormArray;
    dishesFormArray.push(
      new FormGroup({
        dish: new FormControl(randomDishId),
        quantity: new FormControl(1),
      }),
    );
  }

  onDeleteDish(i: number) {
    const dishFormArray = this.orderForm.get('dishes') as FormArray;

    dishFormArray.removeAt(i);
  }

  get controls() {
    return (this.orderForm.get('dishes') as FormArray).controls;
  }

  getResultDishes(array: Dish[]): Dish[] {
    return array.reduce((acc, obj) => {
      const existingIndex = acc.findIndex((item) => item.dish === obj.dish);
      if (existingIndex !== -1) {
        acc[existingIndex].quantity += obj.quantity;
      } else {
        acc.push({ ...obj });
      }
      return acc;
    }, [] as Dish[]);
  }

  onCreate() {
    const table = this.orderForm.get('table')?.value;
    const waiter = this.orderForm.get('waiter')?.value;
    const dishes = (this.orderForm.get('dishes') as FormArray)?.value;
    const resultDishes = this.getResultDishes(dishes);
    if (table !== null && waiter !== null && dishes.length !== 0) {
      this.store.dispatch(
        createOrder({
          dishes: resultDishes,
          createdAt: new Date(),
          table: table,
          waiterId: waiter,
        }),
      );
    }
  }

  onTryCreate() {
    this.startTimeout = setTimeout(() => {
      if (
        (!this.editMode && this.tablesList?.length === 0) ||
        this.waitersList?.length === 0
      ) {
        console.log('поиск свободого официанта');
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([this.router.url]);
        this.onTryCreate();
      } else {
        this.onCreate();
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([this.router.url]);
      }
    }, 5000);
  }

  onClose() {
    if (this.id) {
      this.store.dispatch(
        closeOrder({
          isPaid: true,
          _id: this.id,
          closedAt: new Date(),
        }),
      );
    }
  }

  ngOnDestroy() {
    if (this.tablesSubscription) {
      this.tablesSubscription.unsubscribe();
    }
    if (this.waitersSubscription) {
      this.waitersSubscription.unsubscribe();
    }
    if (this.dishesSubscription) {
      this.dishesSubscription.unsubscribe();
    }
    if (this.ordersSubscription) {
      this.ordersSubscription.unsubscribe();
    }
    if (this.startTimeout) {
      clearTimeout(this.startTimeout);
    }
  }
}
