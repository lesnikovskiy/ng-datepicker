import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  dateTime = '';
  date = '';

  dateTimeSelected(date: string) {
    this.dateTime = date;
  }

  dateSelected(date: string) {
    this.date = date;
  }
}
