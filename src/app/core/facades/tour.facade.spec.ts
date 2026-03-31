import { TestBed } from '@angular/core/testing';

import { TourFacade } from './tour.facade';

describe('TourFacade', () => {
  let service: TourFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TourFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
