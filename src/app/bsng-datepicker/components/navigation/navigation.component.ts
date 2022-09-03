import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'bsng-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  @Input() isPrevDisabled!: boolean;
  @Input() isNextDisabled!: boolean;
  @Input() buttonText!: string;

  @Output() mainButtonClick = new EventEmitter<Event>();
  @Output() prev = new EventEmitter<Event>();
  @Output() next = new EventEmitter<Event>();
}
