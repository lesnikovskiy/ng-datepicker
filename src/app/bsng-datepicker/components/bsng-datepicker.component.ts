import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { CalendarDate } from '../models/calendar-date.model';
import { BsngMinuteRange } from '../models/range.type';
import { addDays, addHours, addMinutes, addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, getDay, isAfter, isBefore, isSameDay, isSameMonth, isToday, parse, setHours, setMinutes, startOfMonth, startOfToday, startOfWeek, subDays, subHours, subMinutes, subMonths } from 'date-fns';

@Component({
  selector: 'bsng-datepicker',
  templateUrl: './bsng-datepicker.component.html',
  styleUrls: ['./bsng-datepicker.component.scss']
})
export class BsngDatepickerComponent implements OnInit {
  @Input() format = 'MM.dd.yyyy';
  @Input() daysOfWeekDisabled: number[] = [];
  @Input() selectedDate: string | null = null;
  @Input() minDate: string | null = null;
  @Input() maxDate: string | null = null;
  @Input() isDateTime = false;
  @Input() minuteStep: BsngMinuteRange = 30;

  @Output() dateSelected = new EventEmitter<string>();

  currentDate!: Date;
  selectedMonth!: Date;
  namesOfDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  weeks: Array<CalendarDate[]> = [];

  show = false;
  isPrevDisabled = false;
  isNextDisabled = false;

  private minDateDate: Date | null = null;
  private maxDateDate: Date | null = null;

  constructor(
    private elementRef: ElementRef
  ) { }

  ngOnInit() {
    this.currentDate = this.selectedDate ? parse(this.selectedDate, this.format, new Date(), { weekStartsOn: 1 }) : new Date();
    this.selectedMonth = this.currentDate;
    this.minDateDate = this.minDate ? parse(this.minDate, this.format, new Date(), { weekStartsOn: 1 }) : null;
    this.maxDateDate = this.maxDate ? parse(this.maxDate, this.format, new Date(), { weekStartsOn: 1 }) : null;

    this.renderCalendar();
  }

  get selectedMonthName(): string {
    return format(this.selectedMonth, 'MMMM', { weekStartsOn: 1 });
  }

  get selectedMonthYear(): string {
    return format(this.selectedMonth, 'yyyy', { weekStartsOn: 1 })
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
    this.selectedMonth = subMonths(this.selectedMonth, 1);
    this.checkNavButtonsDisabled();
    this.renderCalendar();
  }

  nextMonth(): void {
    this.selectedMonth = addMonths(this.selectedMonth, 1);
    this.checkNavButtonsDisabled();
    this.renderCalendar();
  }

  incrementHours() {
    let next = addHours(this.currentDate, 1);
    this.setIncrementDate(next);
    this.timeChanged();
  }

  decrementHours() {
    let prev = subHours(this.currentDate, 1);
    this.setDecrementDate(prev);
    this.timeChanged();
  }

  incrementMinutes() {
    const next = addMinutes(this.currentDate, this.minuteStep);
    this.setIncrementDate(next);
    this.timeChanged();
  }

  decrementMinutes() {
    const prev = subMinutes(this.currentDate, this.minuteStep);
    this.setDecrementDate(prev);
    this.timeChanged();
  }

  addHour(hour: number) {
    this.currentDate = setHours(this.currentDate, hour);
    this.timeChanged();
  }

  addMinite(minute: number) {
    this.currentDate = setMinutes(this.currentDate, minute);
    this.timeChanged();
  }

  isDisabledMonth(currentDate: Date): boolean {
    return isSameMonth(currentDate, startOfToday());
  }

  isSelectedMonth(date: CalendarDate): boolean {
    return isSameMonth(this.selectedMonth, date.date);
  }

  selectDate(date: CalendarDate, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.currentDate = date.date;
    this.selectedDate = format(this.currentDate, this.format, { weekStartsOn: 1 });
    this.dateSelected.emit(this.selectedDate);

    this.show = this.isDateTime ? true : false;

    this.renderCalendar();
  }

  private timeChanged() {
    this.selectedDate = format(this.currentDate, this.format, { weekStartsOn: 1 });
    this.dateSelected.emit(this.selectedDate);

    this.renderCalendar();
  }

  private renderCalendar(): void {
    const dates = this.fillDates();
    const weeks = [];

    while (dates.length > 0) {
      weeks.push(dates.splice(0, 7));
    }

    this.weeks = weeks;
  }

  private fillDates(): CalendarDate[] {
    const dates = eachDayOfInterval({
      start: startOfWeek(startOfMonth(this.selectedMonth), {
        weekStartsOn: 1
      }),
      end: endOfWeek(endOfMonth(this.selectedMonth), {
        weekStartsOn: 1
      })
    });

    return dates.map((date) => ({
      today: isToday(date),
      selected: this.isSelected(date),
      date,
      weekDay: format(date, 'd'),
      disabled: this.isDisabled(date)
    }));
  }

  private checkNavButtonsDisabled() {
    if (this.minDateDate != null) {
      this.isPrevDisabled = isSameMonth(this.minDateDate, this.selectedMonth);
    }

    if (this.maxDateDate != null) {
      this.isNextDisabled = isSameMonth(this.maxDateDate, this.selectedMonth);
    }
  }

  private setIncrementDate(next: Date) {
    while (this.daysOfWeekDisabled.includes(getDay(next))) {
      next = addDays(next, 1);
    }

    if (this.maxDateDate == null || !isAfter(next, this.maxDateDate)) {
      this.currentDate = next;

      if (!isSameMonth(this.selectedMonth, next)) {
        this.selectedMonth = next;
      }
    }
  }

  private setDecrementDate(prev: Date) {
    while (this.daysOfWeekDisabled.includes(getDay(prev))) {
      prev = subDays(prev, 1);
    }

    if (this.minDateDate == null || !isBefore(prev, this.minDateDate)) {
      this.currentDate = prev;

      if (!isSameMonth(this.selectedMonth, prev)) {
        this.selectedMonth = prev;
      }
    }
  }

  private isSelected(date: Date): boolean {
    return isSameDay(date, this.currentDate);
  }

  private isDisabled(date: Date) {
    const day = getDay(date);
    if (this.daysOfWeekDisabled.includes(day))
      return true;

    if (this.minDateDate != null && isBefore(date, this.minDateDate))
      return true;

    if (this.maxDateDate != null && isAfter(date, this.maxDateDate))
      return true;

    return false;
  }
}
