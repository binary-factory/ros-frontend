import { TestBed } from '@angular/core/testing';

import { ROSClientService } from './ros-client.service';

describe('ROSClientService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ROSClientService = TestBed.get(ROSClientService);
    expect(service).toBeTruthy();
  });
});
