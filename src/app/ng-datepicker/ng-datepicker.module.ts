import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgDatepickerComponent } from './ng-datepicker.component';
import { TimepickerComponent } from './timepicker/timepicker.component';

@NgModule({
  declarations: [NgDatepickerComponent, TimepickerComponent],
  exports: [NgDatepickerComponent],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class NgDatepickerModule { }