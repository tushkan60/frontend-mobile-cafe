import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelloComponent } from './hello/hello.component';
import { DishesListComponent } from './dishes/list/dishes-list.component';
import { DishesEditComponent } from './dishes/edit/dishes-edit.component';
import { WaitersListComponent } from './waiters/list/waiters-list.component';
import { TablesListComponent } from './tables/list/tables-list.component';
import { WaiterDetailComponent } from './waiters/detail/waiter-detail.component';
import { OrdersListComponent } from './orders/list/orders-list.component';
import { OrderDetailComponent } from './orders/detail/order-detail.component';
import { StatisticComponent } from './statistic/statistic.component';

const routes: Routes = [
  {
    path: '',
    component: HelloComponent,
  },
  {
    path: 'dishes',
    component: DishesListComponent,
  },
  {
    path: 'dishes/:id',
    component: DishesEditComponent,
  },
  {
    path: 'waiters',
    component: WaitersListComponent,
  },
  {
    path: 'waiters/:id',
    component: WaiterDetailComponent,
  },
  {
    path: 'tables',
    component: TablesListComponent,
  },
  {
    path: 'orders',
    component: OrdersListComponent,
  },
  {
    path: 'orders/:id',
    component: OrderDetailComponent,
  },
  {
    path: 'statistic',
    component: StatisticComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
