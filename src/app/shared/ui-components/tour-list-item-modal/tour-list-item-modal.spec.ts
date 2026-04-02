import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourListItemModal } from './tour-list-item-modal';

describe('TourListItemModal', () => {
  let component: TourListItemModal;
  let fixture: ComponentFixture<TourListItemModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TourListItemModal],
    }).compileComponents();

    fixture = TestBed.createComponent(TourListItemModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
