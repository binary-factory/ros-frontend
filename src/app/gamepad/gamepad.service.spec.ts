import { TestBed } from '@angular/core/testing';

import { GamepadService } from './gamepad.service';

describe('GamepadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GamepadService = TestBed.get(GamepadService);
    expect(service).toBeTruthy();
  });
});
