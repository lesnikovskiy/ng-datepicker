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
}
