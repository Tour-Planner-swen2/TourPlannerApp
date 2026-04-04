import { TestBed } from '@angular/core/testing';

import { TourLogFacade } from './tourlog.facade';

describe('Tourlog', () => {
  let service: TourLogFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TourLogFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
