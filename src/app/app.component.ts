import { Component, ViewChild } from '@angular/core';
import { NgDatepickerComponent } from './ng-datepicker/ng-datepicker.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'datepicker';

  dateSelected(date: string) {
    this.title = date;
  }
}
