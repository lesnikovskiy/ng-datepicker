import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { addYears, eachMonthOfInterval, endOfMonth, endOfYear, format, getYear, isAfter, isBefore, isSameMonth, startOfMonth, startOfYear, subYears } from 'date-fns';

interface Month {
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
  @Input() currentDate: Date | null = null;
  @Input() selectedYear!: Date;
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;

  @Output() selectYearFromList = new EventEmitter<Date>()
  @Output() selectedMonthChange = new EventEmitter<Date>();

  monthList: Month[] = [];

  private currentSelectedYear!: Date;

  ngOnChanges(changes: SimpleChanges) {
    let shouldUpdateList = false;

    if (changes.currentDate?.currentValue) {
      this.currentDate = changes.currentDate.currentValue;
      shouldUpdateList = true;
    }

    if (changes.selectedYear?.currentValue) {
      this.currentSelectedYear = changes.selectedYear.currentValue;
      shouldUpdateList = true;
    }

    if (changes.minDate?.currentValue) {
      this.minDate = changes.minDate.currentValue;
      shouldUpdateList = true;
    }

    if (changes.maxDate?.currentValue) {
      this.maxDate = changes.maxDate.currentValue;
      shouldUpdateList = true;
    }

    if (shouldUpdateList) {
      this.monthList = this.getMonthList();
    }
  }

  get selectedMonthYear(): string {
    return format(this.currentSelectedYear, 'yyyy', { weekStartsOn: 1 });
  }

  get isPrevDisabled(): boolean {
    if (this.minDate == null) return false;

    const prevYear = subYears(this.currentSelectedYear, 1);
    return isBefore(getYear(prevYear), getYear(this.minDate));
  }

  get isNextDisabled(): boolean {
    if (this.maxDate == null) return false;

    const nextYear = addYears(this.currentSelectedYear, 1);
    return isAfter(getYear(nextYear), getYear(this.maxDate));
  }

  mainButtonClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.selectYearFromList.emit(this.currentSelectedYear);
  }
  
  prevYear() {
    this.currentSelectedYear = subYears(this.currentSelectedYear, 1);
    this.monthList = this.getMonthList();
  }

  nextYear() {
    this.currentSelectedYear = addYears(this.currentSelectedYear, 1);
    this.monthList = this.getMonthList();
  }

  selectMonthClick(month: Date, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.selectedMonthChange.emit(month)
  }

  private getMonthList(): Month[] {
    const list = eachMonthOfInterval({
      start: startOfYear(this.currentSelectedYear),
      end: endOfYear(this.currentSelectedYear)
    });

    return list.map(d => ({
      month: d,
      display: format(d, 'MMM', { weekStartsOn: 1 }),
      isActive: this.currentDate != null && isSameMonth(d, this.currentDate),
      isDisabled: this.isDisabled(d)
    }));
  }

  private isDisabled(date: Date): boolean {
    if (this.minDate != null && isBefore(date, startOfMonth(this.minDate))) {
      return true;
    }

    if (this.maxDate != null && isAfter(date, endOfMonth(this.maxDate))) {
      return true;
    }

    return false;
  }
}
