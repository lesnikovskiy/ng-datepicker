import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { CalendarDate } from '../models/calendar-date.model';
import { BsngMinuteRange } from '../models/range.type';
import { addDays, addHours, addMinutes, addMonths, addYears, eachDayOfInterval, endOfMonth, endOfWeek, format, getDay, isAfter, isBefore, isSameDay, isSameMonth, isToday, parse, setHours, setMinutes, startOfMonth, startOfToday, startOfWeek, subDays, subHours, subMinutes, subMonths, subYears } from 'date-fns';

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
  selectedYear!: Date;
  namesOfDays: string[] = [];
  weeks: Array<CalendarDate[]> = [];

  show = false;
  isPrevDisabled = false;
  isNextDisabled = false;

  calendarMonthVisible = true;
  monthListVisible = false;
  yearListVisible = false;

  minDateDate: Date | null = null;
  maxDateDate: Date | null = null;

  constructor(
    private elementRef: ElementRef<HTMLElement>
  ) { }

  ngOnInit() {
    this.currentDate = this.selectedDate ? parse(this.selectedDate, this.format, new Date(), { weekStartsOn: 1 }) : new Date();
    this.selectedMonth = this.currentDate;
    this.selectedYear = this.currentDate;
    this.minDateDate = this.minDate ? parse(this.minDate, this.format, new Date(), { weekStartsOn: 1 }) : null;
    this.maxDateDate = this.maxDate ? parse(this.maxDate, this.format, new Date(), { weekStartsOn: 1 }) : null;
    this.namesOfDays = this.getWeekDayNames();

    this.renderCalendar();
  }

  get selectedMonthButtonText(): string {
    return `${format(this.selectedMonth, 'MMMM', { weekStartsOn: 1 })} ${format(this.selectedYear, 'yyyy', { weekStartsOn: 1 })}`;
  }

  @HostListener('document:click', ['$event'])
  clickOut(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target as HTMLElement)) {
      this.show = false;
    }
  }

  toggleCalendar(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.show = !this.show;
  }

  selectMonthFromList(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.calendarMonthVisible = false;
    this.yearListVisible = false;
    this.monthListVisible = true;
  }

  selectYearFromList(date: Date) {
    this.selectedYear = date;

    this.calendarMonthVisible = false;
    this.monthListVisible = false;
    this.yearListVisible = true;
  }

  selectedMonthChange(month: Date) {
    this.selectedMonth = month;

    this.calendarMonthVisible = true;
    this.yearListVisible = false;
    this.monthListVisible = false;

    this.renderCalendar();
  }

  selectedYearChange(year: Date) {
    this.selectedYear = year;

    this.calendarMonthVisible = false;
    this.yearListVisible = false;
    this.monthListVisible = true;
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
    let dates = eachDayOfInterval({
      start: startOfWeek(startOfMonth(this.selectedMonth), {
        weekStartsOn: 1
      }),
      end: endOfWeek(endOfMonth(this.selectedMonth), {
        weekStartsOn: 1
      })
    });

    if (dates.length === 35) {
      const lastDay = dates[dates.length - 1];
      const nextDay = addDays(lastDay, 1);
      const additionalDates = eachDayOfInterval({
        start: startOfWeek(nextDay, { weekStartsOn: 1 }),
        end: endOfWeek(nextDay, { weekStartsOn: 1 })
      });

      dates = dates.concat(additionalDates);
    }

    return dates.map((date) => ({
      today: isToday(date),
      selected: this.isSelected(date),
      date,
      weekDay: format(date, 'd'),
      disabled: this.isDisabled(date)
    }));
  }

  private getWeekDayNames() {
    const now = new Date();

    const weekDays = eachDayOfInterval({
      start: startOfWeek(now, { weekStartsOn: 1 }),
      end: endOfWeek(now, { weekStartsOn: 1 })
    });

    return weekDays.map(d => format(d, 'EEEEEE'));
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
