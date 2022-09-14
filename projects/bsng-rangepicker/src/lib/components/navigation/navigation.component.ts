import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'bsng-navigation[selectedMonth]',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  @Input() selectedMonth!: Date;
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;
  @Input() isPrevVisible = true;
  @Input() isNextVisible = true;
  @Input() isPrevDisabled = false;
  @Input() isNextDisabled = false;

  @Output() prevMonth = new EventEmitter<Event>();
  @Output() nextMonth = new EventEmitter<Event>();

  

  ngOnInit() {

  }
}
