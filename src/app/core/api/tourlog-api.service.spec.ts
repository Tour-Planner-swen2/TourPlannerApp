import { TestBed } from '@angular/core/testing';

import { TourlogApiService } from './tourlog-api.service';

describe('TourlogApi', () => {
  let service: TourlogApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TourlogApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
