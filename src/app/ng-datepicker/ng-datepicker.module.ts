import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgDatepickerComponent } from './ng-datepicker.component';

@NgModule({
  declarations: [NgDatepickerComponent],
  exports: [NgDatepickerComponent],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class NgDatepickerModule { }