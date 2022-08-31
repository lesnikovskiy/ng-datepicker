import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';

export interface CalendarDate {
  mDate: moment.Moment;
  wDay: number;
  selected?: boolean;
  disabled?: boolean;
  today?: boolean;
}

@Component({
  selector: 'app-ng-datepicker',
  templateUrl: './ng-datepicker.component.html',
  styleUrls: ['./ng-datepicker.component.scss']
})
export class NgDatepickerComponent implements OnInit {
  @Input() format = 'MM.DD.YYYY';
  @Input() daysOfWeekDisabled: number[] = [];
  @Input() selectedDate: string | null = null;
  @Input() minDate: string | null = null;
  @Input() maxDate: string | null = null;
  @Input() isDateTime = false;
  @Input() minuteStep = 30;

  @Output() dateSelected = new EventEmitter<string>();

  currentDate!: moment.Moment;
  selectedMonth!: moment.Moment;
  hours = '00';
  minutes = '00';
  namesOfDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  weeks: Array<CalendarDate[]> = [];

  show = false;
  isPrevDisabled = false;
  isNextDisabled = false;
  
  private minDateMoment: moment.Moment | null = null;
  private maxDateMoment: moment.Moment | null = null;

  constructor(
    private elementRef: ElementRef
  ) { }

  ngOnInit() {
    this.currentDate = this.selectedDate ? moment(this.selectedDate, this.format) : moment();
    this.selectedMonth = moment(this.currentDate);
    this.minDateMoment = moment(this.minDate, this.format);
    this.maxDateMoment = moment(this.maxDate, this.format);

    this.generateTime();
    this.generateCalendar();
  }

  @HostListener('document:click', ['$event'])
  clickOut(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.show = false;
    }
  }

  toggleCalendar(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.show = !this.show;
  }

  prevMonth(): void {
    this.selectedMonth = moment(this.selectedMonth).subtract(1, 'months');
    this.checkNavButtonsDisabled();
    this.generateCalendar();
  }

  nextMonth(): void {
    this.selectedMonth = moment(this.selectedMonth).add(1, 'months');
    this.checkNavButtonsDisabled();
    this.generateCalendar();
  }

  incrementHours() {
    this.currentDate = moment(this.currentDate).add(1, 'hour');
    this.timeChanged();
  }

  decrementHours() {
    this.currentDate = moment(this.currentDate).subtract(1, 'hour');
    this.timeChanged();
  }

  incrementMinutes() {
    this.currentDate = moment(this.currentDate).add(this.minuteStep, 'minutes');
    this.timeChanged();
  }

  decrementMinutes() {
    this.currentDate = moment(this.currentDate).subtract(this.minuteStep, 'minutes');
    this.timeChanged();
  }

  isDisabledMonth(currentDate: moment.Moment): boolean {
    const today = moment();
    return moment(currentDate).isBefore(today, 'months');
  }

  isSelectedMonth(date: CalendarDate): boolean {
    return moment(date.mDate).isSame(this.selectedMonth, 'month');
  }

  selectDate(date: CalendarDate, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.currentDate = date.mDate;
    this.selectedDate = moment(this.currentDate).format(this.format);
    this.dateSelected.emit(this.selectedDate);

    this.show = this.isDateTime ? true : false;

    this.generateTime();
    this.generateCalendar();
  }

  private generateTime() {
    if (this.isDateTime) {
      this.hours = this.fixTimeZero(this.currentDate.hours());
      this.minutes = this.fixTimeZero(this.currentDate.minutes());
    }
  }

  private timeChanged() {
    this.selectedDate = moment(this.currentDate).format(this.format);
    this.dateSelected.emit(this.selectedDate);

    this.generateTime();
    this.generateCalendar();
  }

  private generateCalendar(): void {
    const dates = this.fillDates(this.selectedMonth);
    const weeks = [];

    while (dates.length > 0) {
      weeks.push(dates.splice(0, 7));
    }

    this.weeks = weeks;
  }

  private fillDates(currentMoment: moment.Moment) {
    const firstOfMonth = moment(currentMoment).startOf('month').day();
    const lastOfMonth = moment(currentMoment).endOf('month').day();

    const firstDayOfGrid = moment(currentMoment).startOf('month').subtract(firstOfMonth - 1, 'days');
    const lastDayOfGrid = moment(currentMoment).endOf('month').subtract(lastOfMonth - 1, 'days').add(7, 'days');

    const startCalendar = firstDayOfGrid.date();
    const endCalendar = startCalendar + lastDayOfGrid.diff(firstDayOfGrid, 'days');

    return this.getRange(startCalendar, endCalendar).map((date) => {
      const newDate = moment(firstDayOfGrid).date(date);
      return {
        today: this.isToday(newDate),
        selected: this.isSelected(newDate),
        mDate: newDate,
        wDay: moment(newDate).day(),
        disabled: this.isDisabled(newDate)
      };
    });
  }

  private checkNavButtonsDisabled() {
    if (this.minDateMoment != null) {
      this.isPrevDisabled = this.minDateMoment.month() === this.selectedMonth.month();
    }

    if (this.maxDateMoment != null) {
      this.isNextDisabled = this.maxDateMoment.month() === this.selectedMonth.month();
    }
  }

  private isToday(date: moment.Moment): boolean {
    return moment().isSame(moment(date), 'day');
  }

  private isSelected(date: moment.Moment): boolean {
    return date.isSame(this.currentDate, 'date');
  }

  private isDisabled(date: moment.Moment) {
    const day = moment(date).day();
    if (this.daysOfWeekDisabled.includes(day))
      return true;

    if (this.minDateMoment != null && date.isBefore(this.minDateMoment))
      return true;

    if (this.maxDateMoment != null && date.isAfter(this.maxDateMoment))
      return true;

    return false;
  }

  private getRange(from: number, to: number): number[] {
    const result = [];

    for (let i = from; i < to; i++) {
      result.push(i);
    }

    return result;
  }

  private fixTimeZero(hours: number): string {
    return hours <= 0 || hours <= 9 ? `0${hours}` : `${hours}`;
  }
}
