import { Component } from '@angular/core';
import { TimelineModel } from './bsng-datepicker/models/timeline.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  dateTime = '';
  dateTimeNoLimits = '';
  date = '';

  timelines: TimelineModel[] = [
    {
      title: 'RL Holidays',
      interval: {
        start: new Date(2022, 8, 9, 9, 0, 0),
        end: new Date(2022, 8, 16, 18, 0, 0)
      },
      className: 'rl-holiday'
    },
    {
      title: 'Planning',
      interval: {
        start: new Date(2022, 8, 19, 9, 0, 0),
        end: new Date(2022, 8, 22, 18, 0, 0)
      },
      className: 'planning'
    }
  ];

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
