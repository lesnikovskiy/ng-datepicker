import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Component({
  selector: 'bsng-rangepicker',
  templateUrl: './bsng-rangepicker.component.html',
  styleUrls: ['./bsng-rangepicker.component.scss']
})
export class BsngRangepickerComponent implements OnInit {
  @Input() isDisabled = false;

  hasError = false;
  show = false;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>
  ) { }

  ngOnInit(): void {
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
}
