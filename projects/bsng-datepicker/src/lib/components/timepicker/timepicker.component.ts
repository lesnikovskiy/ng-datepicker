import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { addDays, addHours, addMinutes, eachHourOfInterval, endOfDay, endOfHour, endOfMinute, format, getDay, getMinutes, isAfter, isBefore, isSameMonth, setHours, setMinutes, startOfDay, startOfHour, startOfMinute, subDays, subHours, subMinutes } from 'date-fns';

interface TimeUnit {
  time: number;
  displayTime: string;
  isDisabled: boolean;
}

@Component({
  selector: 'bsng-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.scss']
})
export class TimepickerComponent implements OnChanges {
  @Input() currentDate: Date | null = null;
  @Input() selectedMonth!: Date;
  @Input() minuteStep: 1 | 5 | 10 | 15 | 20 | 30 = 30;
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;
  @Input() daysOfWeekDisabled: number[] = [];

  @Output() setDateTime = new EventEmitter<Date>();

  hoursRange: TimeUnit[] = [];
  minutesRange: TimeUnit[] = [];

  timerVisible = true;
  selectHourVisible = false;
  selectMinuteVisible = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.currentDate?.currentValue) {
      this.currentDate = changes.currentDate.currentValue;
    }

    if (changes.minDate?.currentValue) {
      this.minDate = changes.minDate.currentValue;
    }

    if (changes.maxDate?.currentValue) {
      this.maxDate = changes.maxDate.currentValue;
    }
  }

  getDateHours(): string {
    const date = this.currentDate ?? new Date();
    return format(date, 'HH', { weekStartsOn: 1 });
  }

  getDateMinutes(): string {
    const date = this.currentDate ?? new Date();
    return format(date, 'mm', { weekStartsOn: 1 });
  }

  showHourRangeView(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.hoursRange = this.getHoursInterval();

    this.timerVisible = false;
    this.selectMinuteVisible = false;
    this.selectHourVisible = true;
  }

  showMinuteRangView(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.timerVisible = false;
    this.selectHourVisible = false;
    this.selectMinuteVisible = true;

    this.minutesRange = this.getMinutesInterval();
  }

  addHourClick(hour: number, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.selectHourVisible = false;
    this.selectMinuteVisible = false;
    this.timerVisible = true;

    this.addHour(hour);
  }

  addMinuteClick(minute: number, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.selectHourVisible = false;
    this.selectMinuteVisible = false;
    this.timerVisible = true;

    this.addMinute(minute);
  }

  incrementHours() {
    this.currentDate = this.currentDate ?? new Date();

    const next = addHours(this.currentDate, 1);
    this.setIncrementDate(next);

    this.setDateTime.emit(this.currentDate);
  }

  decrementHours() {
    this.currentDate = this.currentDate ?? new Date();

    const prev = subHours(this.currentDate, 1);
    this.setDecrementDate(prev);

    this.setDateTime.emit(this.currentDate);
  }

  incrementMinutes() {
    this.currentDate = this.currentDate ?? new Date();

    const next = addMinutes(this.currentDate, this.minuteStep);
    this.setIncrementDate(next);

    this.setDateTime.emit(this.currentDate);
  }

  decrementMinutes() {
    this.currentDate = this.currentDate ?? new Date();

    const prev = subMinutes(this.currentDate, this.minuteStep);
    this.setDecrementDate(prev);

    this.setDateTime.emit(this.currentDate);
  }

  private addHour(hour: number) {
    this.currentDate = this.currentDate ?? new Date();

    this.currentDate = setHours(this.currentDate, hour);

    this.setDateTime.emit(this.currentDate);
  }

  private addMinute(minute: number) {
    this.currentDate = this.currentDate ?? new Date();

    this.currentDate = setMinutes(this.currentDate, minute);

    this.setDateTime.emit(this.currentDate);
  }

  private getHoursInterval(): TimeUnit[] {
    const date = this.currentDate != null ? this.currentDate : new Date();

    const hours = eachHourOfInterval({
      start: startOfDay(date),
      end: endOfDay(date)
    });

    return hours.map((h) => ({
      time: +format(h, 'H', { weekStartsOn: 1 }),
      displayTime: format(h, 'HH', { weekStartsOn: 1 }),
      isDisabled: this.isHourDisabled(h)
    }));
  }

  private getMinutesInterval(): TimeUnit[] {
    const date = this.currentDate != null ? this.currentDate : new Date();

    const startDate = startOfHour(date);
    const endDate = endOfHour(date);
    const minStep = this.minuteStep < 5 ? 5 : this.minuteStep;
    let current = setMinutes(startDate, Math.ceil(getMinutes(startDate) / minStep) * minStep);

    const result: TimeUnit[] = [];

    while (endDate > current) {
      result.push({
        time: +format(current, 'm', { weekStartsOn: 1 }),
        displayTime: format(current, 'mm', { weekStartsOn: 1 }),
        isDisabled: this.isMinuteDisabled(current)
      });
      current = addMinutes(current, minStep);
    }

    return result;
  }

  private isHourDisabled(date: Date): boolean {
    if (this.minDate != null && isBefore(date, startOfHour(this.minDate))) {
      return true;
    }

    if (this.maxDate != null && isAfter(date, endOfHour(this.maxDate))) {
      return true;
    }

    return false;
  }

  private isMinuteDisabled(date: Date) {
    if (this.minDate != null && isBefore(date, startOfMinute(this.minDate))) {
      return true;
    }

    if (this.maxDate != null && isAfter(date, endOfMinute(this.maxDate))) {
      return true;
    }

    return false;
  }

  private setIncrementDate(next: Date) {
    while (this.daysOfWeekDisabled.includes(getDay(next))) {
      next = addDays(next, 1);
    }

    if (this.maxDate == null || !isAfter(next, this.maxDate)) {
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

    if (this.minDate == null || !isBefore(prev, this.minDate)) {
      this.currentDate = prev;

      if (!isSameMonth(this.selectedMonth, prev)) {
        this.selectedMonth = prev;
      }
    }
  }
}
