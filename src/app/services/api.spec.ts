import { TestBed } from '@angular/core/testing';

import { WeatherApi } from './api';

describe('Api', () => {
  let service: WeatherApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeatherApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
