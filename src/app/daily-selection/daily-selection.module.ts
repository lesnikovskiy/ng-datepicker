import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DailySelectionComponent } from './daily-selection.component';

@NgModule({
  declarations: [DailySelectionComponent],
  exports: [DailySelectionComponent],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class DailySelectionModule { }