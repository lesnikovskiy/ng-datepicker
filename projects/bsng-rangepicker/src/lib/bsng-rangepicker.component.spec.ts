import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BsngRangepickerComponent } from './bsng-rangepicker.component';

describe('BsngRangepickerComponent', () => {
  let component: BsngRangepickerComponent;
  let fixture: ComponentFixture<BsngRangepickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ BsngRangepickerComponent ]
    });

    fixture = TestBed.createComponent(BsngRangepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
