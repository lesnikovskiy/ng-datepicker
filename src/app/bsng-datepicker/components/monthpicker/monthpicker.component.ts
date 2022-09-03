import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { addYears, eachMonthOfInterval, endOfYear, format, getMonth, isAfter, isBefore, isSameMonth, startOfYear, subYears } from 'date-fns';

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
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;

  @Output() selectYearFromList = new EventEmitter<Date>()
  @Output() selectedMonthChange = new EventEmitter<Date>();

  monthList: Month[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedYear']) {
      this.monthList = this.getMonthList();
    }
  }

  get selectedMonthYear(): string {
    return format(this.selectedYear, 'yyyy', { weekStartsOn: 1 });
  }

  get isPrevDisabled(): boolean {
    return false;
  }

  get isNextDisabled(): boolean {
    return false;
  }

  mainButtonClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.selectYearFromList.emit(this.selectedYear);
  }
  
  prevYear() {
    this.selectedYear = subYears(this.selectedYear, 1);
  }

  nextYear() {
    this.selectedYear = addYears(this.selectedYear, 1);
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
      isDisabled: this.isDisabled(d)
    }));
  }

  private isDisabled(date: Date): boolean {
    if (this.minDate != null && isBefore(getMonth(date), getMonth(this.minDate))) {
      return true;
    }

    if (this.maxDate != null && isAfter(getMonth(date), getMonth(this.maxDate))) {
      return true;
    }

    return false;
  }
}
