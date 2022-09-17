import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { addMonths, endOfDay, endOfWeek, format, Interval, isBefore, isValid, parse, setMonth, setYear, startOfDay, startOfWeek, subMonths } from 'date-fns';
import { RangeOptionModel, SelectedRange } from '../public-api';
import { MonthPosition } from './models/month-position.type';
import { SelectedDate } from './models/selected-date.model';
import { SelectedInterval } from './models/selected-interval.model';
import { SelectedMonth } from './models/selected-month.model';
import { SelectedYear } from './models/selected-year.model';

@Component({
  selector: 'bsng-rangepicker',
  templateUrl: './bsng-rangepicker.component.html',
  styleUrls: ['./bsng-rangepicker.component.scss']
})
export class BsngRangepickerComponent implements OnInit {
  @Input() isDisabled = false;
  @Input() format = 'dd.MM.yyyy';
  @Input() selectedRange: [string, string] | null | undefined = null;
  @Input() customRangeOptions: RangeOptionModel[] = [];
  @Input() daysOfWeekDisabled: number[] = [];
  @Input() isDateTime = false;
  @Input() minDate: string | null | undefined = null;
  @Input() maxDate: string | null | undefined = null;

  @Output() rangeSelected = new EventEmitter<SelectedRange>();

  minDateDate: Date | null = null;
  maxDateDate: Date | null = null;

  selectedInterval: SelectedInterval = { start: null , end: null };
  selectedIntervalValue = 'Select Date Range';
  intervalOptions: RangeOptionModel[] = [
    {
      title: 'Today',
      interval: { start: startOfDay(new Date()), end: endOfDay(new Date()) }
    },
    {
      title: 'This Week',
      interval: { start: startOfWeek(startOfDay(new Date())), end: endOfWeek(endOfDay(new Date())) }
    }
  ];
  selectedRangeOption?: RangeOptionModel;
  selectedStartMonth!: Date;
  selectedEndMonth!: Date;

  hasError = false;
  show = false;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>
  ) { }

  ngOnInit(): void {
    if (this.selectedRange != null) {
      this.selectedInterval = {
        start: parse(this.selectedRange[0], this.format, new Date(), { weekStartsOn: 1 }),
        end: parse(this.selectedRange[1], this.format, new Date(), { weekStartsOn: 1 })
      };
    }

    this.intervalOptions = [
      ...this.intervalOptions,
      ...this.customRangeOptions.filter(q => q.title !== 'Custom' && !q.isCustom),
      {
        title: 'Custom',
        interval: this.getInterval(this.selectedInterval),
        isCustom: true
      }
    ];

    const { start } = this.selectedRangeOption?.interval || {};
    this.selectedStartMonth = start != null ? start as Date : new Date();
    this.selectedEndMonth = addMonths(this.selectedStartMonth, 1);

    this.minDateDate = this.minDate ? parse(this.minDate, this.format, new Date(), { weekStartsOn: 1 }) : null;
    this.maxDateDate = this.maxDate ? parse(this.maxDate, this.format, new Date(), { weekStartsOn: 1 }) : null;
  }

  get currentRangeDisplay(): string {
    const { start, end } = this.selectedInterval;

    if (start == null && end == null) return 'Range not selected';

    const startDate = start != null && isValid(start) ? format(start, this.format, { weekStartsOn: 1 }) : 'Invalid date';
    const endDate = end != null && isValid(end) ? format(end, this.format, { weekStartsOn: 1 }) : 'Invalid date';

    return `${startDate} - ${endDate}`;
  }

  get selectionValid(): boolean {
    const { start, end } = this.selectedInterval;
    return start != null && end != null && isValid(start) && isValid(end);
  }

  @HostListener('document:click', ['$event'])
  clickOut(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target as HTMLElement)) {
      this.cancel(event);
    }
  }

  toggleCalendar(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.show = !this.show;
  }

  selectRange(option: RangeOptionModel, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.selectedRangeOption = option;
    this.setSelectedRange(this.selectedRangeOption.interval);

    if (!this.selectedRangeOption.isCustom) {
      this.show = false;

      const { start, end } = this.selectedRangeOption.interval;
      const startDate = start != null && isValid(start) ? format(start, this.format, { weekStartsOn: 1 }) : null;
      const endDate = end != null && isValid(end) ? format(end, this.format, { weekStartsOn: 1 }) : null;
      this.selectedIntervalValue = startDate != null && endDate != null
        ? `${startDate} - ${endDate}`
        : 'Select Date Range';
    }
  }

  dateSelected({ date, monthPosition }: SelectedDate) {
    const { start, end } = this.selectedInterval;

    if (start != null && end == null) {
      if (isBefore(date, start)) {
        this.selectedInterval = {
          start: startOfDay(date), 
          end: null
        };
      } else {
        this.selectedInterval = {
          start,
          end: endOfDay(date)
        };
      }
    } else {
      this.selectedInterval = {
        start: startOfDay(date),
        end: null
      };
    }

    if (monthPosition === 'start') {
      this.selectedStartMonth = date;
    }

    if (monthPosition === 'end') {
      this.selectedEndMonth = date;
    }
  }

  monthSelected({ month, monthPosition }: SelectedMonth) {
    if (monthPosition === 'start') {
      this.selectedStartMonth = setMonth(this.selectedStartMonth, month);
      this.adjustMonthPosition(monthPosition);
    }

    if (monthPosition === 'end') {
      this.selectedEndMonth = setMonth(this.selectedEndMonth, month);
      this.adjustMonthPosition(monthPosition);
    }
  }

  yearSelected({ year, monthPosition }: SelectedYear) {
    if (monthPosition === 'start') {
      this.selectedStartMonth = setYear(this.selectedStartMonth, year);
      this.adjustMonthPosition(monthPosition);
    }

    if (monthPosition === 'end') {
      this.selectedEndMonth = setYear(this.selectedEndMonth, year);
      this.adjustMonthPosition(monthPosition);
    }
  }

  setSelectedRange({ start, end }: Interval) {
    if (!isValid(start) || !isValid(end)) {
      this.hasError = true;
    } else {
      this.hasError = false;

      const startDate = format(start, this.format, { weekStartsOn: 1 });
      const endDate = format(end, this.format, { weekStartsOn: 1 });

      if (start instanceof Date && end instanceof Date) {
        this.selectedInterval = { start, end };
      }

      this.rangeSelected.emit({
        start: startDate,
        end: endDate
      });
    }
  }

  prevMonth(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.selectedStartMonth = subMonths(this.selectedStartMonth, 1);
    this.selectedEndMonth = subMonths(this.selectedEndMonth, 1);
  }

  nextMonth(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.selectedStartMonth = addMonths(this.selectedStartMonth, 1);
    this.selectedEndMonth = addMonths(this.selectedEndMonth, 1);
  }

  apply(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.show = false;

    const { start, end } = this.selectedInterval;

    const startDate = start != null && isValid(start) ? format(start, this.format, { weekStartsOn: 1 }) : null;
    const endDate = end != null && isValid(end) ? format(end, this.format, { weekStartsOn: 1 }) : null;

    if (startDate != null && endDate != null) {
      this.selectedIntervalValue = `${startDate} - ${endDate}`;

      this.rangeSelected.emit({
        start: startDate,
        end: endDate
      });
    } else {
      this.selectedIntervalValue = 'Select Date Range';
    }
  }

  cancel(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.show = false;

    if (this.selectedRange != null) {
      this.selectedInterval = {
        start: parse(this.selectedRange[0], this.format, new Date(), { weekStartsOn: 1 }),
        end: parse(this.selectedRange[1], this.format, new Date(), { weekStartsOn: 1 })
      };
    } else {
      this.selectedInterval = { start: startOfDay(new Date()), end: endOfDay(new Date()) }
    }

    const { start } = this.selectedRangeOption?.interval || {};
    this.selectedStartMonth = start != null ? start as Date : new Date();
    this.selectedEndMonth = addMonths(this.selectedStartMonth, 1);
  }

  private adjustMonthPosition(position: MonthPosition) {
    if (position === 'start') {
      this.adjustStartMonthPosition();
    }

    if (position === 'end') {
      this.adjustEndMonthPosition();
    }
  }

  private adjustStartMonthPosition() {
    this.selectedEndMonth = addMonths(this.selectedStartMonth, 1);
  }

  private adjustEndMonthPosition() {
    this.selectedStartMonth = subMonths(this.selectedEndMonth, 1);
  }

  private getInterval({ start, end }: SelectedInterval): Interval {
    if (start == null && end == null) {
      return { start: startOfDay(new Date()), end: endOfDay(new Date()) }
    };

    return { start, end } as Interval;
  }
}
