import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearpickerComponent } from './yearpicker.component';

describe('YearpickerComponent', () => {
  let component: YearpickerComponent;
  let fixture: ComponentFixture<YearpickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [YearpickerComponent]
    });

    fixture = TestBed.createComponent(YearpickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
