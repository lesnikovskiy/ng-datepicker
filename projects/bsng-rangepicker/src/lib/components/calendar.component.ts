import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { addDays, addMonths, eachDayOfInterval, endOfDay, endOfMonth, endOfWeek, format, getDay, isAfter, isBefore, isSameDay, isSameMonth, isToday, startOfDay, startOfMonth, startOfToday, startOfWeek, subMonths } from 'date-fns';

interface CalendarDay {
  date: Date;
  weekDay: string;
  selected: boolean;
  disabled: boolean;
  today: boolean;
}

@Component({
  selector: 'bsng-calendar[selectedMonth]',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  @Input() selectedDate: Date | null = null;
  @Input() selectedMonth!: Date;
  @Input() daysOfWeekDisabled: number[] = [];
  @Input() isDateTime = false;
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;

  @Output() dateSelected = new EventEmitter<Date>();

  namesOfDays: string[] = [];
  weeks: CalendarDay[][] = [];

  currentDate!: Date;

  ngOnInit() {
    this.namesOfDays = this.getWeekDayNames();
    this.renderCalendar();
  }

  ngOnChanges(changes: SimpleChanges) {
    let shouldRerenderCalendar = false;

    if (changes.selectedDate?.currentValue) {
      this.selectedDate = changes.selectedDate.currentValue;
      shouldRerenderCalendar = true;
    }

    if (changes.selectedMonth?.currentValue) {
      this.selectedMonth = changes.selectedMonth.currentValue;
      shouldRerenderCalendar = true;
    }

    if (changes.minDate?.currentValue) {
      this.minDate = changes.minDate.currentValue;
      shouldRerenderCalendar = true;
    }

    if (changes.maxDate?.currentValue) {
      this.maxDate = changes.maxDate.currentValue;
      shouldRerenderCalendar = true;
    }

    if (shouldRerenderCalendar) {
      this.renderCalendar();
    }
  }

  get isPrevDisabled(): boolean {
    if (this.minDate == null) return false;

    const prevMonth = subMonths(this.selectedMonth, 1);
    return isBefore(prevMonth, startOfMonth(this.minDate));
  }

  get isNextDisabled(): boolean {
    if (this.maxDate == null) return false;

    const next = addMonths(this.selectedMonth, 1);
    return isAfter(next, endOfMonth(this.maxDate));
  }

  get selectedMonthButtonText(): string {
    return `${format(this.selectedMonth, 'MMMM', { weekStartsOn: 1 })} ${format(this.selectedMonth, 'yyyy', { weekStartsOn: 1 })}`;
  }

  getDayClassList(day: CalendarDay): Record<string, boolean> {
    return {
      'today': day.today,
      'selected': day.selected,
      'disabled': day.disabled,
      'diff-month': !this.isSelectedMonth(day)
    };
  }

  isDisabledMonth(currentDate: Date): boolean {
    return isSameMonth(currentDate, startOfToday());
  }

  isSelectedMonth(date: CalendarDay): boolean {
    return isSameMonth(this.selectedMonth, date.date);
  }

  selectDate({ date }: CalendarDay, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.isDateTime) {
      this.dateSelected.emit(new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        this.currentDate?.getHours() ?? 0,
        this.currentDate?.getMinutes() ?? 0
      ));
    } else {
      this.dateSelected.emit(date);
    }
  }

  prevMonth(): void {
    this.selectedMonth = subMonths(this.selectedMonth, 1);
    this.renderCalendar();
  }

  nextMonth(): void {
    this.selectedMonth = addMonths(this.selectedMonth, 1);
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

  private fillDates(): CalendarDay[] {
    let dates = eachDayOfInterval({
      start: startOfWeek(startOfMonth(this.selectedMonth), {
        weekStartsOn: 1
      }),
      end: endOfWeek(endOfMonth(this.selectedMonth), {
        weekStartsOn: 1
      })
    });

    if (dates.length <= 35) {
      const lastDay = dates[dates.length - 1] as Date;
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
      weekDay: format(date, 'd', { weekStartsOn: 1 }),
      disabled: this.isDateDisabled(date)
    }));
  }

  private getWeekDayNames() {
    const now = new Date();

    const weekDays = eachDayOfInterval({
      start: startOfWeek(now, { weekStartsOn: 1 }),
      end: endOfWeek(now, { weekStartsOn: 1 })
    });

    return weekDays.map(d => format(d, 'EEEEEE', { weekStartsOn: 1 }));
  }

  private isSelected(date: Date): boolean {
    if (this.currentDate == null) return false;
    return isSameDay(date, this.currentDate);
  }

  private isDateDisabled(date: Date) {
    const day = getDay(date);
    if (this.daysOfWeekDisabled.includes(day)) {
      return true;
    }

    if (this.minDate != null && isBefore(date, startOfDay(this.minDate))) {
      return true;
    }

    if (this.maxDate != null && isAfter(date, endOfDay(this.maxDate))) {
      return true;
    }

    return false;
  }
}
