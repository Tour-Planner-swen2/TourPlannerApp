import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourLogModal } from './tour-log-modal';

describe('TourLogModal', () => {
  let component: TourLogModal;
  let fixture: ComponentFixture<TourLogModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TourLogModal],
    }).compileComponents();

    fixture = TestBed.createComponent(TourLogModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
