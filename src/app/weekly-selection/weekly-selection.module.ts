import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeeklySelectionComponent } from './weekly-selection.component';

@NgModule({
  declarations: [WeeklySelectionComponent],
  exports: [WeeklySelectionComponent],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class WeeklySelectionModule { }