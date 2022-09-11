import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { addMonths, endOfDay, endOfWeek, format, Interval, isBefore, isValid, parse, startOfDay, startOfWeek } from 'date-fns';
import { RangeOptionModel, SelectedRange } from '../public-api';
import { SelectedInterval } from './models/selected-interval.model';

@Component({
  selector: 'bsng-rangepicker',
  templateUrl: './bsng-rangepicker.component.html',
  styleUrls: ['./bsng-rangepicker.component.scss']
})
export class BsngRangepickerComponent implements OnInit {
  @Input() isDisabled = false;
  @Input() format = 'dd.MM.yyyy';
  @Input() selectedRange: [string, string] | null | undefined = null;
  @Input() isDateTime = false;
  @Input() customRangeOptions: RangeOptionModel[] = [];

  @Output() rangeSelected = new EventEmitter<SelectedRange>();

  selectedInterval: SelectedInterval = { start: null , end: null };
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
  }

  get currentRangeDisplay(): string {
    const { start, end } = this.selectedInterval;

    if (start == null && end == null) return 'Select range in calendar';

    const startDate = start != null && isValid(start) ? format(start, this.format, { weekStartsOn: 1 }) : 'Invalid date';
    const endDate = end != null && isValid(end) ? format(end, this.format, { weekStartsOn: 1 }) : 'Invalid date';

    return `${startDate} - ${endDate}`;
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

  selectRange(option: RangeOptionModel, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.selectedRangeOption = option;

    if (!this.selectedRangeOption.isCustom) {
      this.setSelectedRange(this.selectedRangeOption.interval);
      this.show = false;
    }
  }

  dateSelected(date: Date) {
    const { start, end } = this.selectedInterval;

    if (start != null && end == null) {
      if (isBefore(date, start)) {
        this.selectedInterval = {
          start: date, 
          end: null
        };
      } else {
        this.selectedInterval = {
          start,
          end: date
        };
      }
    } else {
      this.selectedInterval = {
        start: date,
        end: null
      };
    }
  }

  setSelectedRange({ start, end }: Interval) {
    if (!isValid(start) || !isValid(end)) {
      this.hasError = true;
    } else {
      this.hasError = false;

      const startDate = format(start, this.format, { weekStartsOn: 1 });
      const endDate = format(end, this.format, { weekStartsOn: 1 });

      this.rangeSelected.emit({
        start: startDate,
        end: endDate
      });
    }
  }

  private getInterval({ start, end }: SelectedInterval): Interval {
    if (start == null && end == null) {
      return { start: startOfDay(new Date()), end: endOfDay(new Date()) }
    };

    return { start, end } as Interval;
  }
}
