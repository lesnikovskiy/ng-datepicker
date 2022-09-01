import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MinuteRange } from '../../models/range.type';
import * as moment from 'moment';

@Component({
  selector: 'bsng-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.scss']
})
export class TimepickerComponent {
  @Input() currentDate!: moment.Moment;
  @Input() minuteStep: MinuteRange = 30;

  @Output() incrementHours = new EventEmitter();
  @Output() decrementHours = new EventEmitter();
  @Output() incrementMinutes = new EventEmitter();
  @Output() decrementMinutes = new EventEmitter();
  @Output() addHour = new EventEmitter<number>();
  @Output() addMinute = new EventEmitter<number>();

  hoursRange: number[] = [];
  minutesRange: number[] = [];

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

    this.timerVisible = false;
    this.selectHourVisible = false;
    this.selectMinuteVisible = true;

    this.minutesRange = this.getMinutesRange();
  }

  addHourClick(hour: number, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.selectHourVisible = false;
    this.selectMinuteVisible = false;
    this.timerVisible = true;

    this.addHour.emit(hour);
  }

  addMinuteClick(minute: number, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.selectHourVisible = false;
    this.selectMinuteVisible = false;
    this.timerVisible = true;

    this.addMinute.emit(minute);
  }

  private getHoursRange(): number[] {
    const result = [];

    for (let i = 0; i < 24; i++) {
      result.push(i);
    }

    return result;
  }

  private getMinutesRange(): number[] {
    const result = [];
    const minStep = this.minuteStep < 5 ? 5 : this.minuteStep;

    let i = 0;
    while(i < 60) {
      result.push(i);
      i += minStep;
    }

    return result;
  }
}
