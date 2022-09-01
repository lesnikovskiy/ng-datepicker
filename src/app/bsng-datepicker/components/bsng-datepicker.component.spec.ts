import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BsngDatepickerComponent } from './bsng-datepicker.component';

describe('BsngDatepickerComponent', () => {
  let component: BsngDatepickerComponent;
  let fixture: ComponentFixture<BsngDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BsngDatepickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BsngDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
