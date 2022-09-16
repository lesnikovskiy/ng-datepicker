import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { addDays, addMonths, eachDayOfInterval, endOfDay, endOfMonth, endOfWeek, format, getDay, isAfter, isBefore, isSameDay, isSameMonth, isToday, isWithinInterval, setMonth, setYear, startOfDay, startOfMonth, startOfWeek, subMonths } from 'date-fns';
import { SelectedDate } from '../../models/selected-date.model';
import { SelectedInterval } from '../../models/selected-interval.model';

interface CalendarDay {
  date: Date;
  weekDay: string;
  isStartDate: boolean;
  isEndDate: boolean;
  isInRange: boolean;
  disabled: boolean;
  today: boolean;
  isSameMonth: boolean;
}

@Component({
  selector: 'bsng-calendar[selectedMonth]',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  @Input() selectedInterval!: SelectedInterval;
  @Input() selectedMonth!: Date;
  @Input() monthPosition!: 'start' | 'end';
  @Input() daysOfWeekDisabled: number[] = [];
  @Input() isDateTime = false;
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;

  @Output() dateSelected = new EventEmitter<SelectedDate>();
  @Output() prevMonth = new EventEmitter<Event>();
  @Output() nextMonth = new EventEmitter<Event>();

  namesOfDays: string[] = [];
  weeks: CalendarDay[][] = [];

  isPrevVisible = true;
  isNextVisible = true;

  ngOnInit() {
    this.isPrevVisible = this.monthPosition === 'start';
    this.isNextVisible = this.monthPosition === 'end';

    this.namesOfDays = this.getWeekDayNames();
    this.renderCalendar();
  }

  ngOnChanges(changes: SimpleChanges) {
    let shouldRerenderCalendar = false;

    if (changes.selectedInterval?.currentValue) {
      this.selectedInterval = changes.selectedInterval.currentValue;
      shouldRerenderCalendar = true;
    }

    if (changes.selectedMonth?.currentValue) {
      this.selectedMonth = changes.selectedMonth.currentValue;
      shouldRerenderCalendar = true;
    }

    if (changes.monthPosition?.currentValue) {
      this.monthPosition = changes.monthPosition.currentValue;
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
    if (!this.isPrevVisible || this.minDate == null) return false;

    const prevMonth = subMonths(new Date(this.selectedMonth), 1);
    return isBefore(prevMonth, startOfMonth(this.minDate));
  }

  get isNextDisabled(): boolean {
    if (!this.isNextVisible || this.maxDate == null) {
      return false;
    };

    const next = addMonths(this.selectedMonth, 1);
    return isAfter(next, endOfMonth(this.maxDate));
  }

  getDayClassList(day: CalendarDay): Record<string, boolean> {
    return {
      'today': day.today,
      'in-range': day.isInRange,
      'start-date': day.isStartDate,
      'end-date': day.isEndDate,
      'disabled': day.disabled,
      'diff-month': !day.isSameMonth
    };
  }

  selectDate({ date }: CalendarDay, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.isDateTime) {
      this.dateSelected.emit({
        date: new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours() ?? 0,
          date.getMinutes() ?? 0
        ),
        monthPosition: this.monthPosition
      });
    } else {
      this.dateSelected.emit({
        date,
        monthPosition: this.monthPosition
      });
    }
  }

  monthSelect(month: number) {
    this.selectedMonth = setMonth(this.selectedMonth, month);
    this.renderCalendar();
  }

  yearSelect(year: number) {
    this.selectedMonth = setYear(this.selectedMonth, year);
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

    return dates.map((date) => {
      const isSame = isSameMonth(this.selectedMonth, date);

      return {
        today: isToday(date),
        isStartDate: this.isStartDate(date) && isSame,
        isEndDate: this.isEndDate(date) && isSame,
        isInRange: this.isInRange(date) && isSame,
        date,
        weekDay: format(date, 'd', { weekStartsOn: 1 }),
        disabled: this.isDateDisabled(date),
        isSameMonth: isSame
      };
    });
  }

  private getWeekDayNames() {
    const now = new Date();

    const weekDays = eachDayOfInterval({
      start: startOfWeek(now, { weekStartsOn: 1 }),
      end: endOfWeek(now, { weekStartsOn: 1 })
    });

    return weekDays.map(d => format(d, 'EEEEEE', { weekStartsOn: 1 }));
  }

  private isStartDate(date: Date): boolean {
    const { start } = this.selectedInterval || {};
    if (start == null) return false;

    return start != null && isSameDay(date, start);
  }

  private isEndDate(date: Date): boolean {
    const { end } = this.selectedInterval || {};
    if (end == null) return false;

    return end != null && isSameDay(date, end);
  }

  private isInRange(date: Date) {
    const { start, end } = this.selectedInterval || {};

    if (start == null || end == null) return false;

    return isWithinInterval(date, { start, end });
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
