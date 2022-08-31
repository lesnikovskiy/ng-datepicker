import { Component, EventEmitter, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.scss']
})
export class TimepickerComponent implements OnInit {
  @Input() hours!: string;
  @Input() minutes!: string;

  incrementHours = new EventEmitter();
  decrementHours = new EventEmitter();
  incrementMinutes = new EventEmitter();
  decrementMinutes = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }
}
