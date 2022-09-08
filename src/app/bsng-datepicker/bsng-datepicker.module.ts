import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsngDatepickerComponent } from './components/bsng-datepicker.component';
import { TimepickerComponent } from './components/timepicker/timepicker.component';
import { MonthpickerComponent } from './components/monthpicker/monthpicker.component';
import { YearpickerComponent } from './components/yearpicker/yearpicker.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { CalendarComponent } from './components/calendar/calendar.component';

@NgModule({
  declarations: [
    BsngDatepickerComponent,
    TimepickerComponent,
    MonthpickerComponent,
    YearpickerComponent,
    NavigationComponent,
    CalendarComponent
  ],
  exports: [BsngDatepickerComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class BsngDatepickerModule { }
