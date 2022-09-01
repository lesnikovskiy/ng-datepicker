import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgDatepickerComponent } from './components/ng-datepicker.component';
import { TimepickerComponent } from './components/timepicker/timepicker.component';
import { DisplayTimePipe } from './pipes/display-time.pipe';

@NgModule({
  declarations: [NgDatepickerComponent, TimepickerComponent, DisplayTimePipe],
  exports: [NgDatepickerComponent],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class NgDatepickerModule { }