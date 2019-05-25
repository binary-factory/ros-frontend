import { Injectable } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject, timer, Observable } from 'rxjs';
import { ROSTopicService } from '../ros/shared/services/ros-topic.service';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { takeWhile, map } from 'rxjs/operators';

interface XboxControllerInputs {
  readonly A: boolean;
  readonly B: boolean;
  readonly X: boolean;
  readonly Y: boolean;
  readonly LB: boolean;
  readonly RB: boolean;
  readonly LT: boolean;
  readonly RT: boolean;
  readonly select: boolean;
  readonly start: boolean;
  readonly leftStick: boolean;
  readonly rightStick: boolean;
  readonly up: boolean;
  readonly down: boolean;
  readonly left: boolean;
  readonly right: boolean;
  readonly home: boolean;
  leftStickX: number;
  leftStickY: number;
  rightStickX: number;
  rightStickY: number;
};

@Injectable({
  providedIn: 'root'
})
export class GamepadService {

  readonly fpsPolling: number = 25;

  readonly deadZoneX: number = 0.2;

  readonly deadZoneY: number = 0.2;

  readonly speedAngular: number = 2;

  readonly speedLinear: number = 2;

  private gamepads: Gamepad[] = [];

  private gamepadSource$ = new BehaviorSubject<Gamepad[]>([]);

  private controlTopic: AnonymousSubject<any>;

  private enabled: boolean = false;

  constructor(private eventManager: EventManager,
    private logger: NGXLogger,
    private rosTopicService: ROSTopicService) {

    this.eventManager.addGlobalEventListener('window', 'gamepadconnected', this.handleGamepadConnected.bind(this));
    this.eventManager.addGlobalEventListener('window', 'gamepaddisconnected', this.handleGamepadDisconnected.bind(this));

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

    this.gamepadTwist$(gamepad.index).subscribe((twist) => this.controlTopic.next(twist));
  }

  private handleGamepadDisconnected(event: GamepadEvent) {
    const gamepad = event.gamepad;
    this.logger.info('Gamepad disconnected!', gamepad);
    delete this.gamepads[gamepad.index];
    this.gamepadSource$.next(this.gamepads);
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

  private getGamepad(index: number) {
    return navigator.getGamepads()[index];
  }

  private gamepadInput$(index: number) {
    return timer(0, 1000 / this.fpsPolling)
      .pipe(
        takeWhile(() => {
          const gamepad = this.getGamepad(index);
          return this.enabled && !!gamepad;
        }),
        map(_ => {
          const gamepad = this.getGamepad(index);
          const inputs: XboxControllerInputs = {
            A: gamepad.buttons[0].pressed,
            B: gamepad.buttons[1].pressed,
            X: gamepad.buttons[2].pressed,
            Y: gamepad.buttons[3].pressed,
            LB: gamepad.buttons[4].pressed,
            RB: gamepad.buttons[5].pressed,
            LT: gamepad.buttons[6].pressed, // Alternative: gamepad.buttons[6].value
            RT: gamepad.buttons[7].pressed, // Alternative: gamepad.buttons[7].value
            select: gamepad.buttons[8].pressed,
            start: gamepad.buttons[9].pressed,
            leftStick: gamepad.buttons[10].pressed,
            rightStick: gamepad.buttons[11].pressed,
            up: gamepad.buttons[12].pressed,
            down: gamepad.buttons[13].pressed,
            left: gamepad.buttons[14].pressed,
            right: gamepad.buttons[15].pressed,
            home: gamepad.buttons[16].pressed,
            leftStickX: this.applyDeadZoneX(gamepad.axes[0]),
            leftStickY: this.applyDeadZoneY(gamepad.axes[1]),
            rightStickX: this.applyDeadZoneX(gamepad.axes[2]),
            rightStickY: this.applyDeadZoneY(gamepad.axes[3])
          };

          return inputs;
        })
      );
  }

  private gamepadTwist$(index: number) {
    return this.gamepadInput$(index)
      .pipe(
        map((controllerInput) => {
          return {
            linear: {
              x: controllerInput.leftStickY * (-1) * this.speedLinear,
              y: 0,
              z: 0
            },
            angular: {
              x: 0,
              y: 0,
              z: controllerInput.rightStickX * (-1) * this.speedAngular
            }
          };
        })
      );
  }

  enable() {
    this.enabled = true;
    for (let i = 0; i < this.gamepads.length; i++) {
      this.gamepadTwist$(i).subscribe((twist) => this.controlTopic.next(twist));
    }
  }

  disable() {
    this.enabled = false;
  }
}
