import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { eachMonthOfInterval, endOfYear, format, isSameMonth, startOfYear } from 'date-fns';

export interface Month {
  month: Date;
  display: string;
  isActive: boolean;
  isDisabled: boolean;
}

@Component({
  selector: 'bsng-monthpicker',
  templateUrl: './monthpicker.component.html',
  styleUrls: ['./monthpicker.component.scss']
})
export class MonthpickerComponent implements OnChanges {
  @Input() currentDate!: Date;
  @Input() selectedYear!: Date;

  @Output() selectedMonthChange = new EventEmitter<Date>();

  monthList: Month[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedYear']) {
      this.monthList = this.getMonthList();
    }
  }

  selectMonthClick(month: Date, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.selectedMonthChange.emit(month)
  }

  private getMonthList(): Month[] {
    const list = eachMonthOfInterval({
      start: startOfYear(this.selectedYear),
      end: endOfYear(this.selectedYear)
    });

    return list.map(d => ({
      month: d,
      display: format(d, 'MMM'),
      isActive: isSameMonth(d, this.currentDate),
      isDisabled: false //todo: implement disabled logic from min/max date
    }));
  }
}
