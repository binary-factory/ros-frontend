import { TestBed } from '@angular/core/testing';

import { ROSService } from './ros.service';

describe('ROSService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ROSService = TestBed.get(ROSService);
    expect(service).toBeTruthy();
  });
});
