import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TimepickerComponent } from './timepicker.component';
import { DisplayTimePipe } from '../../pipes/display-time.pipe';
import * as moment from 'moment';

describe('TimepickerComponent', () => {
  let component: TimepickerComponent;
  let fixture: ComponentFixture<TimepickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimepickerComponent, DisplayTimePipe]
    });

    fixture = TestBed.createComponent(TimepickerComponent);
    component = fixture.componentInstance;
    component.currentDate = moment('12.10.2022 09:30', 'DD.MM.YYYY HH:mm');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create time', () => {
    const timeButtons = fixture.debugElement.queryAll(By.css('.time-control button'));

    expect(timeButtons.length).toBe(2);
    expect(timeButtons[0].nativeElement.textContent).toContain('09');
    expect(timeButtons[1].nativeElement.textContent).toContain('30');
  });
});
