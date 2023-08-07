import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { NavigationComponent } from './navigation/navigation.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HelloComponent } from './hello/hello.component';
import * as fromApp from './store/app.reducer';
import { DishesEffects } from './store/dishes/dishes.effects';
import { HttpClientModule } from '@angular/common/http';
import { DishesListComponent } from './dishes/list/dishes-list.component';
import { DishesEditComponent } from './dishes/edit/dishes-edit.component';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { WaitersListComponent } from './waiters/list/waiters-list.component';
import { WaitersEffects } from './store/waiters/waiters.effects';
import { TablesListComponent } from './tables/list/tables-list.component';
import { TablesEffects } from './store/tables/tables.effects';
import { MatCardModule } from '@angular/material/card';
import { WaiterDetailComponent } from './waiters/detail/waiter-detail.component';
import { ShiftsEffects } from './store/shifts/shifts.effects';
import { MatSelectModule } from '@angular/material/select';
import { OrdersListComponent } from './orders/list/orders-list.component';
import { OrdersEffects } from './store/orders/orders.effects';
import { OrderDetailComponent } from './orders/detail/order-detail.component';
import { StatisticComponent } from './statistic/statistic.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    HelloComponent,
    DishesListComponent,
    DishesEditComponent,
    WaitersListComponent,
    TablesListComponent,
    WaiterDetailComponent,
    OrdersListComponent,
    OrderDetailComponent,
    StatisticComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    StoreModule.forRoot(fromApp.appReducer),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    EffectsModule.forRoot([
      DishesEffects,
      WaitersEffects,
      TablesEffects,
      ShiftsEffects,
      OrdersEffects,
    ]),
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSelectModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
