import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsngRangepickerComponent } from './bsng-rangepicker.component';

@NgModule({
  declarations: [
    BsngRangepickerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    BsngRangepickerComponent
  ]
})
export class BsngRangepickerModule { }
