import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgDatepickerModule } from './ng-datepicker/ng-datepicker.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgDatepickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
