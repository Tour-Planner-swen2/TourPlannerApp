import { TestBed } from '@angular/core/testing';

import { TourApiService } from './tour-api.service';

describe('TourApi', () => {
  let service: TourApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TourApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
