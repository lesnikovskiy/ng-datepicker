import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { range } from 'lodash';

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

  @Output() dateSelected = new EventEmitter<string>();

  currentDate = moment();
  currentMonth!: number;
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
    this.selectedDate = moment(this.currentDate).format(this.format);
    this.currentMonth = this.currentDate.month();
    this.minDateMoment = moment(this.minDate, this.format);
    this.maxDateMoment = moment(this.maxDate, this.format);
    this.generateCalendar();
  }

  @HostListener('document:click', ['$event'])
  clickOut(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.show = false;
    }
  }

  showCalendar(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.show = !this.show;
  }

  prevMonth(): void {
    this.currentDate = moment(this.currentDate).subtract(1, 'months');
    this.currentMonth = this.currentDate.month();
    this.checkNavButtonsDisabled();
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentDate = moment(this.currentDate).add(1, 'months');
    this.currentMonth = this.currentDate.month();
    this.checkNavButtonsDisabled();
    this.generateCalendar();
  }

  isDisabledMonth(currentDate: moment.Moment): boolean {
    const today = moment();
    return moment(currentDate).isBefore(today, 'months');
  }

  isSelectedMonth(date: CalendarDate): boolean {
    return moment(date.mDate).isSame(this.currentDate, 'month');
  }

  selectDate(date: CalendarDate) {
    this.selectedDate = moment(date.mDate).format(this.format);

    this.dateSelected.emit(this.selectedDate);

    this.generateCalendar();
    this.show = !this.show;
  }

  private generateCalendar(): void {
    const dates = this.fillDates(this.currentDate);
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

    return range(startCalendar, startCalendar + lastDayOfGrid.diff(firstDayOfGrid, 'days')).map((date) => {
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
      const minDateMonth = this.minDateMoment.month();
      const currMonth = this.currentMonth;
      console.log(`prev: ${minDateMonth} curr: ${currMonth}`)
      this.isPrevDisabled = this.minDateMoment.month() === this.currentMonth;
    }

    if (this.maxDateMoment != null) {
      this.isNextDisabled = this.maxDateMoment.month() === this.currentMonth;
    }
  }

  private isToday(date: moment.Moment): boolean {
    return moment().isSame(moment(date), 'day');
  }

  private isSelected(date: moment.Moment): boolean {
    return this.selectedDate === moment(date).format(this.format);
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
}
