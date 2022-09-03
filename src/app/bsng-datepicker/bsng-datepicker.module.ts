import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsngDatepickerComponent } from './components/bsng-datepicker.component';
import { TimepickerComponent } from './components/timepicker/timepicker.component';
import { MonthpickerComponent } from './components/monthpicker/monthpicker.component';
import { DisplayTimePipe } from './pipes/display-time.pipe';

@NgModule({
  declarations: [BsngDatepickerComponent, TimepickerComponent, DisplayTimePipe, MonthpickerComponent],
  exports: [BsngDatepickerComponent],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class BsngDatepickerModule { }