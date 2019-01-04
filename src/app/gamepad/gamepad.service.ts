import { Injectable } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GamepadService {

  private gamepads: Gamepad[] = [];

  private gamepadSource$ = new BehaviorSubject<Gamepad[]>([]);

  constructor(private eventManager: EventManager, private logger: NGXLogger) {
    eventManager.addGlobalEventListener('window', 'gamepadconnected', this.handleGamepadConnected.bind(this));
    eventManager.addGlobalEventListener('window', 'gamepaddisconnected', this.handleGamepadDisconnected.bind(this));
  }

  get gamepads$() {
    return this.gamepadSource$.asObservable();
  }

  private handleGamepadConnected(event: GamepadEvent) {
    const gamepad = event.gamepad;
    this.logger.info('Gamepad connected!', gamepad);
    this.gamepads[gamepad.index] = gamepad;
    this.gamepadSource$.next(this.gamepads);
  }

  private handleGamepadDisconnected(event: GamepadEvent) {
    const gamepad = event.gamepad;
    this.logger.info('Gamepad disconnected!', gamepad);
    delete this.gamepads[gamepad.index];
    this.gamepadSource$.next(this.gamepads);
  }
}
