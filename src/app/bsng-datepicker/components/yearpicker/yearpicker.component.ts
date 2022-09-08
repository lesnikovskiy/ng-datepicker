import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { addYears, eachYearOfInterval, format, getYear, isAfter, isBefore, isSameYear, subYears } from 'date-fns';

interface Year {
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
  @Input() currentDate: Date | null = null;
  @Input() selectedYear!: Date;
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;

  @Output() selectedYearChange = new EventEmitter<Date>()

  yearRangeText = '';
  yearList: Year[] = [];

  private currentSelectedYear!: Date;

  ngOnChanges(changes: SimpleChanges): void {
    let shouldRenderYearView = false;

    if (changes.currentDate?.currentValue) {
      this.currentDate = changes.currentDate.currentValue;
      shouldRenderYearView = true;
    }

    if (changes.selectedYear?.currentValue) {
      this.currentSelectedYear = changes.selectedYear.currentValue;
      shouldRenderYearView = true;
    }

    if (changes.minDate?.currentValue) {
      this.minDate = changes.minDate.currentValue;
      shouldRenderYearView = true;
    }

    if (changes.maxDate?.currentValue) {
      this.maxDate = changes.maxDate.currentValue;
      shouldRenderYearView = true;
    }

    if (shouldRenderYearView) {
      this.renderYearView();
    }
  }

  get isPrevDisabled(): boolean {
    if (this.minDate == null) return false;

    const firstYear = this.yearList[0];
    if (firstYear == null) return false;

    const prevYear = subYears(firstYear.date as Date, 1);
    return isBefore(getYear(prevYear), getYear(this.minDate));
  }

  get isNextDisabled(): boolean {
    if (this.maxDate == null) return false;

    const lastYear = this.yearList[this.yearList.length-1];
    if (lastYear == null) return false;

    const nextYear = addYears(lastYear.date, 1);
    return isAfter(getYear(nextYear), getYear(this.maxDate));
  }

  prevYearRange() {
    this.currentSelectedYear = subYears(this.currentSelectedYear, 12);
    this.renderYearView();
  }

  nextYearRange() {
    this.currentSelectedYear = addYears(this.currentSelectedYear, 12);
    this.renderYearView();
  }

  selectYear(year: Date, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.selectedYearChange.emit(year);
  }

  private renderYearView() {
    this.yearList = this.getYearList();
    const firstYear = this.yearList[0];
    const lastYear = this.yearList[this.yearList.length - 1];

    if (firstYear != null && lastYear != null) {
      this.yearRangeText = `${format(firstYear.date, 'yyyy', { weekStartsOn: 1 })} - ${format(lastYear.date, 'yyyy', { weekStartsOn: 1 })}`;
    }
  }

  private getYearList(): Year[] {
    const years = eachYearOfInterval({
      start: subYears(this.currentSelectedYear, 5),
      end: addYears(this.currentSelectedYear, 6)
    });
    
    return years.map(y => ({
      date: y,
      display: format(y, 'yyyy', { weekStartsOn: 1 }),
      isActive: this.currentDate != null && isSameYear(this.currentDate, y),
      isDisabled: this.isDisabled(y)
    }));
  }

  private isDisabled(date: Date): boolean {
    if (this.minDate != null && isBefore(getYear(date), getYear(this.minDate))) {
      return true;
    }

    if (this.maxDate != null && isAfter(getYear(date), getYear(this.maxDate))) {
      return true;
    }

    return false;
  }
}
