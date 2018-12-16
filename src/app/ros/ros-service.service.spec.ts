import { TestBed } from '@angular/core/testing';

import { ROSServiceService } from './ros-service.service';

describe('ROSServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ROSServiceService = TestBed.get(ROSServiceService);
    expect(service).toBeTruthy();
  });
});
