import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearpickerComponent } from './yearpicker.component';

describe('YearpickerComponent', () => {
  let component: YearpickerComponent;
  let fixture: ComponentFixture<YearpickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [YearpickerComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(YearpickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
