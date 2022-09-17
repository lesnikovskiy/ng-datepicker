import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { addYears, eachMonthOfInterval, eachYearOfInterval, endOfMonth, endOfYear, format, getMonth, getYear, isAfter, isBefore, isSameMonth, isSameYear, startOfMonth, startOfYear, subYears } from 'date-fns';
import { MonthPosition } from '../../models/month-position.type';
import { SelectedMonth } from '../../models/selected-month.model';
import { SelectedYear } from '../../models/selected-year.model';

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
export class NavigationComponent implements OnChanges, OnInit {
  @Input() selectedMonth!: Date;
  @Input() monthPosition!: MonthPosition;
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;
  @Input() isPrevDisabled = false;
  @Input() isNextDisabled = false;

  @Output() prevMonth = new EventEmitter<Event>();
  @Output() nextMonth = new EventEmitter<Event>();
  @Output() monthSelected = new EventEmitter<SelectedMonth>();
  @Output() yearSelected = new EventEmitter<SelectedYear>();

  isPrevVisible!: boolean;
  isNextVisible!: boolean;
  monthList: DateOption[] = [];
  yearList: DateOption[] = [];

  ngOnInit(): void {
    this.isPrevVisible = this.monthPosition === 'start';
    this.isNextVisible = this.monthPosition === 'end';
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

  selectMonth(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    const target = event.target as HTMLSelectElement;
    const month = Number.parseInt(target.value, 10);
    !isNaN(month) && this.monthSelected.emit({
      month,
      monthPosition: this.monthPosition
    })
  }

  selectYear(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    const target = event.target as HTMLSelectElement;
    const year = Number.parseInt(target.value, 10);
    !isNaN(year) && this.yearSelected.emit({
      year,
      monthPosition: this.monthPosition
    });
  }

  private getMonthList(): DateOption[] {
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

  private getYearList(): DateOption[] {
    const interval = eachYearOfInterval({
      start: subYears(startOfYear(new Date()), 100),
      end: addYears(startOfYear(new Date()), 100)
    });

    return interval.map((date: Date) => ({
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
