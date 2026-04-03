import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourLogItem } from './tour-log-item';

describe('TourLogItem', () => {
  let component: TourLogItem;
  let fixture: ComponentFixture<TourLogItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TourLogItem],
    }).compileComponents();

    fixture = TestBed.createComponent(TourLogItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
