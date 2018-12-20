import { Component } from '@angular/core';
import { ROSTopicService } from './ros/ros-topic.service';
import { ROSParamService } from './ros/ros-param.service';
import { ROSNodeDetails } from './ros/models/node-details.model';
import { ROSNodeService } from './ros/ros-node.service';
import { Observable } from 'rxjs';
import { ROSServiceService } from './ros/ros-service.service';
import { ROSClientService } from './ros/ros-client.service';
import { retry } from 'rxjs/operators';
import { GamepadService } from './gamepad/gamepad.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  topics: {
    name: string;
    type: Observable<string>;
  }[] = [];

  services: string[] = [];

  params: {
    name: string;
    type: Observable<string>;
  }[] = [];

  nodes: string[] = [];

  constructor(
    private rosClient: ROSClientService,
    private rosTopicService: ROSTopicService,
    private rosServiceService: ROSServiceService,
    private rosParamService: ROSParamService,
    private rosNodeService: ROSNodeService,
    private gamepadService: GamepadService) {


    this.rosClient.connected$.subscribe((connected) => {
      if (connected) {
        this.test();
      }


    });
    let timer: NodeJS.Timer;
    this.gamepadService.gamepads$.subscribe((gamepads) => {
      if (gamepads[0] && gamepads[0].connected) {
        timer = setInterval(() => {
          const gamepad = navigator.getGamepads()[0];

          for (var i = 0; i < gamepad.axes.length; i += 2) {
            console.log("Stick " + (Math.ceil(i / 2) + 1) + ": " + gamepad.axes[i] + "," + gamepad.axes[i + 1]);
          }
        }, 100);
      } else {
        clearInterval(timer);
      }
    })
  }

  test() {
    this.rosTopicService.getTopicNames().subscribe((topics) => {
      for (let topic of topics) {
        this.topics.push({
          name: topic,
          type: this.rosTopicService.getTopicType(topic)
        });
      }
    });

    this.rosServiceService.getServiceNames().subscribe((services) => {
      this.services = services;
    });

    this.rosParamService.getParamNames().subscribe((params) => {
      for (let param of params) {
        this.params.push({
          name: param,
          type: this.rosParamService.getParam(param)
        });
      }
    });

    this.rosNodeService.getNodes().subscribe((nodes) => {
      this.nodes = nodes;
    });


    const topic = this.rosTopicService.createTopicSubject({
      name: '/turtle1/cmd_vel',
      messageType: 'geometry_msgs/Twist'
    });

    topic.pipe(retry(5)).subscribe((pos) => {
      console.log(pos);
    });

  }
}
