import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { format, isValid, parse } from 'date-fns';
import { TimelineModel } from '../models/timeline.model';

@Component({
  selector: 'bsng-datepicker',
  templateUrl: './bsng-datepicker.component.html',
  styleUrls: ['./bsng-datepicker.component.scss']
})
export class BsngDatepickerComponent implements OnInit, OnChanges {
  @Input() format = 'MM.dd.yyyy';
  @Input() isReadonly = true;
  @Input() isClearable = false;
  @Input() isDisabled = false;
  @Input() daysOfWeekDisabled: number[] = [];
  @Input() selectedDate: string | null = null;
  @Input() minDate: string | null = null;
  @Input() maxDate: string | null = null;
  @Input() isDateTime = false;
  @Input() minuteStep: 1 | 5 | 10 | 15 | 20 | 30 = 30;
  @Input() timelines: TimelineModel[] = [];

  @Output() dateSelected = new EventEmitter<string | null>();

  currentDate: Date | null = null;
  selectedMonth!: Date;
  selectedYear!: Date;

  show = false;
  hasError = false;

  calendarMonthVisible = true;
  monthListVisible = false;
  yearListVisible = false;

  minDateDate: Date | null = null;
  maxDateDate: Date | null = null;

  constructor(
    private elementRef: ElementRef<HTMLElement>
  ) { }

  ngOnInit() {
    this.currentDate = this.selectedDate ? parse(this.selectedDate, this.format, new Date(), { weekStartsOn: 1 }) : null;
    this.selectedMonth = this.currentDate != null ? this.currentDate : new Date();
    this.selectedYear = this.currentDate != null ? this.currentDate : new Date();
    this.minDateDate = this.minDate ? parse(this.minDate, this.format, new Date(), { weekStartsOn: 1 }) : null;
    this.maxDateDate = this.maxDate ? parse(this.maxDate, this.format, new Date(), { weekStartsOn: 1 }) : null;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedDate?.currentValue) {
      this.currentDate = this.selectedDate ? parse(changes.selectedDate.currentValue, this.format, new Date(), { weekStartsOn: 1 }) : null;
    }

    if (changes.minDate?.currentValue) {
      this.minDateDate = this.minDate ? parse(changes.minDate.currentValue, this.format, new Date(), { weekStartsOn: 1 }) : null;
    }

    if (changes.maxDate?.currentValue) {
      this.maxDateDate = this.maxDate ? parse(changes.maxDate.currentValue, this.format, new Date(), { weekStartsOn: 1 }) : null;
    }

    if (changes.daysOfWeekDisabled?.currentValue) {
      this.daysOfWeekDisabled = changes.daysOfWeekDisabled.currentValue;
    }

    if (changes.isDisabled?.currentValue) {
      this.isDisabled = changes.isDisabled.currentValue;
    }

    this.hasError = false;
  }

  @HostListener('document:click', ['$event'])
  clickOut(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target as HTMLElement)) {
      this.show = false;
    }
  }

  dateInputChange(event: Event) {
    if (this.isReadonly) return;

    const target = event.target as HTMLInputElement;

    const date = parse(target.value, this.format, new Date(), { weekStartsOn: 1 });

    this.setCurrentDate(date);
  }

  toggleCalendar(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.isDisabled) {
      this.show = !this.show;
    }
  }

  clearDate(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.setCurrentDate(null);
  }

  selectMonthFromList() {
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
  }

  selectedYearChange(year: Date) {
    this.selectedYear = year;

    this.calendarMonthVisible = false;
    this.yearListVisible = false;
    this.monthListVisible = true;
  }

  selectDate(date: Date) {
    this.setCurrentDate(date);

    this.show = this.isDateTime ? true : false;
  }

  setCurrentDate(date: Date | null) {
    const isDateValid = isValid(date);
    this.hasError = !isDateValid;

    if (!isDateValid) return;

    this.currentDate = date;

    this.selectedDate = this.currentDate != null
      ? format(this.currentDate, this.format, { weekStartsOn: 1 })
      : null;

    this.dateSelected.emit(this.selectedDate);
  }
}
