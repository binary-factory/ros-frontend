import { Injectable } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject } from 'rxjs';
import { ROSTopicService } from '../ros/shared/services/ros-topic.service';
import { AnonymousSubject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class GamepadService {

  readonly fpsPolling: number = 25;

  readonly deadZoneX: number = 0.2;

  readonly deadZoneY: number = 0.2;

  readonly speedAngular: number = 2;

  readonly speedLinear: number = 2;

  private timer: number;

  private animationRequest: number;

  private gamepads: Gamepad[] = [];

  private gamepadSource$ = new BehaviorSubject<Gamepad[]>([]);

  private controlTopic: AnonymousSubject<any>;

  private enabled: boolean = false;

  constructor(private eventManager: EventManager,
    private logger: NGXLogger,
    private rosTopicService: ROSTopicService) {

    eventManager.addGlobalEventListener('window', 'gamepadconnected', this.handleGamepadConnected.bind(this));
    eventManager.addGlobalEventListener('window', 'gamepaddisconnected', this.handleGamepadDisconnected.bind(this));

    this.controlTopic = this.rosTopicService.createTopicSubject({
      name: '/turtle1/cmd_vel',
      messageType: 'geometry_msgs/Twist'
    });
  }

  get gamepads$() {
    return this.gamepadSource$.asObservable();
  }

  private handleGamepadConnected(event: GamepadEvent) {
    const gamepad = event.gamepad;
    this.logger.info('Gamepad connected!', gamepad);
    this.gamepads[gamepad.index] = gamepad;
    this.gamepadSource$.next(this.gamepads);

    this.checkStartEnd();
  }

  private handleGamepadDisconnected(event: GamepadEvent) {
    const gamepad = event.gamepad;
    this.logger.info('Gamepad disconnected!', gamepad);
    delete this.gamepads[gamepad.index];
    this.gamepadSource$.next(this.gamepads);

    this.checkStartEnd();
  }

  private applyDeadZoneX(xVal: number) {
    if (Math.abs(xVal) < this.deadZoneX) {
      xVal = 0;
    }
    return xVal;
  }

  private applyDeadZoneY(yVal: number) {
    if (Math.abs(yVal) < this.deadZoneY) {
      yVal = 0;
    }
    return yVal;
  }

  private get gamepad() {
    return navigator.getGamepads()[0];
  }

  private pollGamepadInput() {

    const gamepad = this.gamepad;

    const mapping = {
      'A': gamepad.buttons[0].pressed,
      'B': gamepad.buttons[1].pressed,
      'X': gamepad.buttons[2].pressed,
      'Y': gamepad.buttons[3].pressed,
      'LB': gamepad.buttons[4].pressed,
      'RB': gamepad.buttons[5].pressed,
      'LT': gamepad.buttons[6].pressed, // Alternative: gamepad.buttons[6].value
      'RT': gamepad.buttons[7].pressed, // Alternative: gamepad.buttons[7].value
      'select': gamepad.buttons[8].pressed,
      'start': gamepad.buttons[9].pressed,
      'leftStick': gamepad.buttons[10].pressed,
      'rightStick': gamepad.buttons[11].pressed,
      'up': gamepad.buttons[12].pressed,
      'down': gamepad.buttons[13].pressed,
      'left': gamepad.buttons[14].pressed,
      'right': gamepad.buttons[15].pressed,
      'home': gamepad.buttons[16].pressed,
      'leftStickX': this.applyDeadZoneX(gamepad.axes[0]),
      'leftStickY': this.applyDeadZoneY(gamepad.axes[1]),
      'rightStickX': this.applyDeadZoneX(gamepad.axes[2]),
      'rightStickY': this.applyDeadZoneY(gamepad.axes[3])
    };

    const message = {
      linear: {
        x: mapping.leftStickY * (-1) * this.speedLinear,
        y: 0,
        z: 0
      },
      angular: {
        x: 0,
        y: 0,
        z: mapping.rightStickX * (-1) * this.speedAngular
      }
    }

    this.controlTopic.next(message);
  }

  private checkStartEnd() {
    if (this.enabled && this.gamepad) {
      if (!this.timer) {
        this.timer = setInterval(() => {
          cancelAnimationFrame(this.animationRequest);
          this.animationRequest = requestAnimationFrame(this.pollGamepadInput.bind(this));
        }, 1000 / this.fpsPolling) as unknown as number;
      }
    } else {
      cancelAnimationFrame(this.animationRequest);
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  enable() {
    this.enabled = true;
    this.checkStartEnd();
  }

  disable() {
    this.enabled = false;
    this.checkStartEnd();
  }
}
