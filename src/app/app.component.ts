import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  dateTime = '';
  dateTimeNoLimits = '';
  date = '';

  dateTimeSelected(date: string) {
    this.dateTime = date;
  }

  dateTimeNoLimsSelected(date: string) {
    this.dateTimeNoLimits = date;
  }

  dateSelected(date: string) {
    this.date = date;
  }
}
