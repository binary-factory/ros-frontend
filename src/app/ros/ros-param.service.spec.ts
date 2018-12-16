import { TestBed } from '@angular/core/testing';

import { ROSParamService } from './ros-param.service';

describe('ROSParamService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ROSParamService = TestBed.get(ROSParamService);
    expect(service).toBeTruthy();
  });
});
