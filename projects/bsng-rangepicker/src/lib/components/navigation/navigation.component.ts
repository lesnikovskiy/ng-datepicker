import { Component, Input, OnInit } from '@angular/core';

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

  isPrevDisabled = false;
  isNextDisabled = false;

  ngOnInit() {

  }

  prev(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }

  next(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }
}
