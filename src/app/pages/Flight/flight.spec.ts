import { TestBed } from '@angular/core/testing';

import { Flight } from './flight';

describe('Flight', () => {
  let service: Flight;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Flight);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
