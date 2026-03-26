import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteModal } from './route-modal';

describe('RouteModal', () => {
  let component: RouteModal;
  let fixture: ComponentFixture<RouteModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouteModal],
    }).compileComponents();

    fixture = TestBed.createComponent(RouteModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
