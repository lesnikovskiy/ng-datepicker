import { Component } from '@angular/core';
import { TimelineModel } from 'bsng-datepicker';
import { RangeOptionModel, SelectedRange } from 'bsng-rangepicker';
import { endOfDay, endOfWeek, startOfDay, startOfWeek, startOfYear, subDays } from 'date-fns';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  dateTime = '';
  dateTimeNoLimits = '';
  date = '';
  selectedRange: SelectedRange | null = null;

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

  customOptions: RangeOptionModel[] = [
    {
      title: 'This Business Week',
      interval: {
        start: startOfWeek(startOfDay(new Date()), { weekStartsOn: 1 }),
        end: subDays(endOfWeek(endOfDay(new Date()), { weekStartsOn: 1 }), 2)
      }
    },
    {
      title: 'Up to Today',
      interval: { start: startOfYear(new Date(2008, 0, 1, 0, 0)), end: endOfDay(new Date()) }
    }
  ];

  dateTimeSelected(date: string) {
    date && (this.dateTime = date);
  }

  dateTimeNoLimsSelected(date: string) {
    date && (this.dateTimeNoLimits = date);
  }

  dateSelected(date: string) {
    date && (this.date = date);
  }

  rangeSelected(range: SelectedRange) {
    this.selectedRange = range;
  }
}
