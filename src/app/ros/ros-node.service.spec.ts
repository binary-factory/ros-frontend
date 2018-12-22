import { TestBed } from '@angular/core/testing';

import { ROSNodeService } from './ros-node.service';

describe('ROSNodeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ROSNodeService = TestBed.get(ROSNodeService);
    expect(service).toBeTruthy();
  });
});
