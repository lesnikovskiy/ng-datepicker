import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthpickerComponent } from './monthpicker.component';

describe('MonthpickerComponent', () => {
  let component: MonthpickerComponent;
  let fixture: ComponentFixture<MonthpickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonthpickerComponent]
    });

    fixture = TestBed.createComponent(MonthpickerComponent);
    component = fixture.componentInstance;
    component.selectedYear = new Date();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
