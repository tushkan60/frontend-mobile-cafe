import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { createDish, updateDish } from '../../store/dishes/dishes.action';

@Component({
  selector: 'app-edit',
  templateUrl: './dishes-edit.component.html',
  styleUrls: ['./dishes-edit.component.css'],
})
export class DishesEditComponent implements OnInit, OnDestroy {
  dishForm!: FormGroup;
  subscription!: Subscription;
  editMode = false;
  id!: string | null;

  constructor(
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>,
  ) {}

  ngOnInit(): void {
    this.dishForm = new FormGroup({
      name: new FormControl(null),
      price: new FormControl(null),
    });
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id && this.id !== ':new') {
      this.id = this.id.substring(1);
      this.subscription = this.store
        .select('dishes')
        .subscribe((dishesState) => {
          const foundDish = dishesState.dishes?.find(
            (dish) => dish._id === this.id,
          );
          if (foundDish) {
            this.editMode = true;
            this.dishForm.patchValue(foundDish);
          }
        });
    } else {
      this.editMode = false;
    }
  }

  onClick() {
    if (this.editMode) {
      this.store.dispatch(
        updateDish({
          dish: {
            name: this.dishForm.value.name,
            _id: this.id,
            price: +this.dishForm.value.price,
          },
        }),
      );
    } else {
      this.store.dispatch(
        createDish({
          dish: {
            name: this.dishForm.value.name,
            price: +this.dishForm.value.price,
          },
        }),
      );
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
