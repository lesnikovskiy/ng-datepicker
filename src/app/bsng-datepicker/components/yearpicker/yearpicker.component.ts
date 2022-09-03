import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { addYears, eachYearOfInterval, format, isSameYear, subYears } from 'date-fns';

export interface Year {
  date: Date,
  display: string;
  isActive: boolean,
  isDisabled: boolean
}

@Component({
  selector: 'bsng-yearpicker',
  templateUrl: './yearpicker.component.html',
  styleUrls: ['./yearpicker.component.scss']
})
export class YearpickerComponent implements OnChanges {
  @Input() currentDate!: Date;
  @Input() selectedYear!: Date;

  @Output() selectedYearChange = new EventEmitter<Date>()

  yearList: Year[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedYear'] != null) {
      this.yearList = this.getYearList();
    }
  }

  selectYear(year: Date, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.selectedYearChange.emit(year);
  }

  private getYearList(): Year[] {
    const years = eachYearOfInterval({
      start: subYears(this.selectedYear, 5),
      end: addYears(this.selectedYear, 6)
    });
    
    return years.map(y => ({
      date: y,
      display: format(y, 'yyyy'),
      isActive: isSameYear(this.selectedYear, y),
      isDisabled: false //todo: implement disabled logic from min/max date
    }));
  }
}
