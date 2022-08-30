import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DailySelectionModule } from './daily-selection/daily-selection.module';
import { WeeklySelectionModule } from './weekly-selection/weekly-selection.module';
import { NgDatepickerModule } from './ng-datepicker/ng-datepicker.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DailySelectionModule,
    WeeklySelectionModule,
    NgDatepickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
