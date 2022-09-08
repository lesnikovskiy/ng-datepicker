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

  dateTimeSelected(date: string | null) {
    date && (this.dateTime = date);
  }

  dateTimeNoLimsSelected(date: string | null) {
    date && (this.dateTimeNoLimits = date);
  }

  dateSelected(date: string | null) {
    date && (this.date = date);
  }
}
