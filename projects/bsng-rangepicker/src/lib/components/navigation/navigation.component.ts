import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { addYears, eachMonthOfInterval, eachYearOfInterval, endOfMonth, endOfYear, format, getMonth, getYear, isAfter, isBefore, isSameMonth, isSameYear, startOfMonth, startOfYear, subYears } from 'date-fns';

interface DateOption {
  date: number;
  display: string;
  isSelected: boolean;
  isDisabled: boolean;
}

@Component({
  selector: 'bsng-navigation[selectedMonth]',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnChanges {
  @Input() selectedMonth!: Date;
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;
  @Input() isPrevVisible = true;
  @Input() isNextVisible = true;
  @Input() isPrevDisabled = false;
  @Input() isNextDisabled = false;

  @Output() prevMonth = new EventEmitter<Event>();
  @Output() nextMonth = new EventEmitter<Event>();

  monthList: DateOption[] = [];
  yearList: DateOption[] = [];

  ngOnInit(): void {
    this.monthList = this.getMonthList();
    this.yearList = this.getYearList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    let updateUi = false;

    if (changes.selectedMonth?.currentValue) {
      this.selectedMonth = changes.selectedMonth.currentValue;
      updateUi = true;
    }

    if (changes.minDate?.currentValue) {
      this.minDate = changes.minDate.currentValue;
      updateUi = true;
    }

    if (changes.maxDate?.currentValue) {
      this.maxDate = changes.maxDate.currentValue;
      updateUi = true;
    }

    if (changes.isPrevVisible?.currentValue) {
      this.isPrevVisible = changes.isPrevVisible.currentValue;
      updateUi = true;
    }

    if (changes.isNextVisible?.currentValue) {
      this.isNextVisible = changes.isNextVisible.currentValue;
      updateUi = true;
    }

    if (changes.isPrevDisabled?.currentValue) {
      this.isPrevDisabled = changes.isPrevDisabled.currentValue;
      updateUi = true;
    }

    if (changes.isNextDisabled?.currentValue) {
      this.isNextDisabled = changes.isNextDisabled.currentValue;
      updateUi = true;
    }

    if (updateUi) {
      this.monthList = this.getMonthList();
      this.yearList = this.getYearList();
    }
  }

  getMonthList(): DateOption[] {
    return eachMonthOfInterval({
      start: startOfYear(this.selectedMonth),
      end: endOfYear(this.selectedMonth)
    }).map(date => ({
      date: getMonth(date),
      display: format(date, 'MMM', { weekStartsOn: 1 }),
      isSelected: this.isSelectedMonth(date),
      isDisabled: this.isMonthDisabled(date)
    }));
  }

  getYearList(): DateOption[] {
    const interval = this.isNextDisabled
      ? eachYearOfInterval({
        start: startOfYear(this.selectedMonth),
        end: subYears(this.selectedMonth, 100)
      })
      : eachYearOfInterval({
        start: startOfYear(this.selectedMonth),
        end: addYears(this.selectedMonth, 100)
      });

    return interval.map(date => ({
      date: getYear(date),
      display: format(date, 'yyyy', { weekStartsOn: 1 }),
      isSelected: this.isSelectedYear(date),
      isDisabled: this.isYearDisabled(date)
    }));
  }

  private isSelectedMonth(date: Date): boolean {
    return isSameMonth(date, this.selectedMonth);
  }

  private isSelectedYear(date: Date): boolean {
    return isSameYear(date, this.selectedMonth);
  }

  private isMonthDisabled(date: Date): boolean {
    if (this.minDate != null && isBefore(date, startOfMonth(this.minDate))) {
      return true;
    }

    if (this.maxDate != null && isAfter(date, endOfMonth(this.maxDate))) {
      return true;
    }

    return false;
  }

  private isYearDisabled(date: Date): boolean {
    if (this.minDate != null && isBefore(date, startOfYear(this.minDate))) {
      return true;
    }

    if (this.maxDate != null && isAfter(date, endOfYear(this.maxDate))) {
      return true;
    }

    return false;
  }
}
