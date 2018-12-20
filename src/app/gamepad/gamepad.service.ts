import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EventManager } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class GamepadService {

  private _gamepads: Gamepad[] = [];

  private _gamepadSource$ = new BehaviorSubject<Gamepad[]>([]);

  constructor(private _eventManager: EventManager) {
    console.log(_eventManager);
    _eventManager.addGlobalEventListener('window', 'gamepadconnected', this._handleGamepadConnected.bind(this));
    _eventManager.addGlobalEventListener('window', 'gamepaddisconnected', this._handleGamepadDisconnected.bind(this));
  }

  private _handleGamepadConnected(event: GamepadEvent) {
    console.log('1')
    const gamepad = event.gamepad;
    this._gamepads[gamepad.index] = gamepad;
    this._gamepadSource$.next(this._gamepads);
  }


  private _handleGamepadDisconnected(event: GamepadEvent) {
    console.log('2')
    const gamepad = event.gamepad;
    delete this._gamepads[gamepad.index];
    this._gamepadSource$.next(this._gamepads);
  }

  get gamepads$() {
    return this._gamepadSource$.asObservable();
  }
}
