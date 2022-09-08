import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthpickerComponent } from './monthpicker.component';

describe('MonthpickerComponent', () => {
  let component: MonthpickerComponent;
  let fixture: ComponentFixture<MonthpickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonthpickerComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(MonthpickerComponent);
    component = fixture.componentInstance;
    component.currentDate = new Date();
    component.selectedYear = new Date();
    component.ngOnChanges({
      selectedYear: new SimpleChange(new Date(), new Date(), true)
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
