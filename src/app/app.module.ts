import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BsngDatepickerModule } from 'bsng-datepicker';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BsngDatepickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
