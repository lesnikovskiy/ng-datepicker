import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { endOfDay, endOfWeek, format, Interval, isValid, parse, startOfDay, startOfWeek } from 'date-fns';
import { RangeOptionModel, SelectedRange } from '../public-api';

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

  selectedInterval: Interval | null = null;
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

  hasError = false;
  show = false;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>
  ) { }

  ngOnInit(): void {
    this.selectedInterval = this.selectedRange
      ? {
        start: parse(this.selectedRange[0], this.format, new Date(), { weekStartsOn: 1 }),
        end: parse(this.selectedRange[1], this.format, new Date(), { weekStartsOn: 1 })
      }
      : null;

    this.intervalOptions = [
      ...this.intervalOptions,
      ...this.customRangeOptions.filter(q => q.title !== 'Custom' && !q.isCustom),
      {
        title: 'Custom',
        interval: this.selectedInterval != null ? this.selectedInterval : { start: startOfDay(new Date()), end: endOfDay(new Date()) },
        isCustom: true
      }
    ]
  }

  get currentRangeDisplay(): string {
    const { start, end } = this.selectedInterval || {};

    if (start == null && end == null) return 'Select range in calendar';

    const startDate =  start != null && isValid(start) ? format(start, this.format, { weekStartsOn: 1 }) : 'Invalid date';
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
}
