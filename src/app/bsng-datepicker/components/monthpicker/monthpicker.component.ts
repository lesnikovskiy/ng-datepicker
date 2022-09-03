import { Component, Input, OnInit } from '@angular/core';
import { eachMonthOfInterval, endOfYear, format, isSameMonth, startOfYear } from 'date-fns';

export interface Month {
  date: Date;
  display: string;
  isActive: boolean;
}

@Component({
  selector: 'bsng-monthpicker',
  templateUrl: './monthpicker.component.html',
  styleUrls: ['./monthpicker.component.scss']
})
export class MonthpickerComponent implements OnInit {
  @Input() currentDate!: Date;
  @Input() selectedMonth!: Date;

  monthList: Month[] = [];

  ngOnInit() {
    this.monthList = this.getMonthList();
  }

  getMonthList(): Month[] {
    const list = eachMonthOfInterval({
      start: startOfYear(this.selectedMonth),
      end: endOfYear(this.selectedMonth)
    });

    console.log(format(this.currentDate, 'dd.MM.yyyy'))
    return list.map(d => ({
      date: d,
      display: format(d, 'MMM'),
      isActive: isSameMonth(d, this.currentDate)
    }));
  }
}
