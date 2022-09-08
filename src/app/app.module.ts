import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BsngDatepickerModule } from 'bsng-datepicker';
import { BsngRangepickerModule } from 'bsng-rangepicker';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BsngDatepickerModule,
    BsngRangepickerModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
