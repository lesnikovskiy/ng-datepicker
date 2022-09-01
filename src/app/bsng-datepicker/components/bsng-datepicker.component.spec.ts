import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BsngDatepickerComponent } from './bsng-datepicker.component';

describe('BsngDatepickerComponent', () => {
  let component: BsngDatepickerComponent;
  let fixture: ComponentFixture<BsngDatepickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BsngDatepickerComponent]
    });

    fixture = TestBed.createComponent(BsngDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
