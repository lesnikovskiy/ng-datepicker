import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { addYears, eachYearOfInterval, format, getYear, isAfter, isBefore, isSameYear, subYears } from 'date-fns';

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
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;

  @Output() selectedYearChange = new EventEmitter<Date>()

  yearRangeText = '';
  yearList: Year[] = [];

  private currentSelectedYear!: Date;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedYear'] != null) {
      this.currentSelectedYear = this.selectedYear;
      this.renderYearView();
    }
  }

  get isPrevDisabled(): boolean {
    return this.yearList[0].isDisabled;
  }

  get isNextDisabled(): boolean {
    return this.yearList[this.yearList.length-1].isDisabled;
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
    this.yearRangeText = `${format(this.yearList[0].date, 'yyyy')} - ${format(this.yearList[this.yearList.length - 1].date, 'yyyy')}`;
  }

  private getYearList(): Year[] {
    const years = eachYearOfInterval({
      start: subYears(this.currentSelectedYear, 5),
      end: addYears(this.currentSelectedYear, 6)
    });
    
    return years.map(y => ({
      date: y,
      display: format(y, 'yyyy'),
      isActive: isSameYear(this.currentSelectedYear, y),
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
