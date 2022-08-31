import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.scss']
})
export class TimepickerComponent {
  @Input() hours!: string;
  @Input() minutes!: string;

  @Output() incrementHours = new EventEmitter();
  @Output() decrementHours = new EventEmitter();
  @Output() incrementMinutes = new EventEmitter();
  @Output() decrementMinutes = new EventEmitter();

  hoursRange: string[] = [];
  minutesRange: string[] = [];

  timerVisible = true;
  selectHourVisible = false;
  selectMinuteVisible = false;

  showHourRangeView(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.hoursRange = this.getHoursRange();

    this.timerVisible = false;
    this.selectMinuteVisible = false;
    this.selectHourVisible = true;
  }

  showMinuteRangView(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.minutesRange = this.getMinutesRange();
  }

  getHoursRange(): string[] {
    const result = [];

    for (let i = 0; i < 24; i++) {
      result.push(this.fixTimeZero(i));
    }

    return result;
  }

  getMinutesRange(): string[] {
    const result = [];

    for (let i = 0; i < 60; i + 5) {
      result.push(this.fixTimeZero(i));
    }

    return result;
  }

  private fixTimeZero(hours: number): string {
    return hours <= 0 || hours <= 9 ? `0${hours}` : `${hours}`;
  }
}
