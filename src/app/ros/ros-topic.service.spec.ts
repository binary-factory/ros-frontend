import { TestBed } from '@angular/core/testing';

import { ROSTopicService } from './ros-topic.service';

describe('ROSTopicService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ROSTopicService = TestBed.get(ROSTopicService);
    expect(service).toBeTruthy();
  });
});
