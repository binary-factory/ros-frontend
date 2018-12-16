import { Component } from '@angular/core';
import { ROSTopicService } from './ros/ros-topic.service';
import { ROSParamService } from './ros/ros-param.service';
import { ROSNodeDetails } from './ros/models/node-details.model';
import { ROSNodeService } from './ros/ros-node.service';
import { Observable } from 'rxjs';
import { ROSServiceService } from './ros/ros-service.service';

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
    private rosTopicService: ROSTopicService,
    private rosServiceService: ROSServiceService,
    private rosParamService: ROSParamService,
    private rosNodeService: ROSNodeService) {
      this.rosTopicService.topics.subscribe((topics) => {
        for (let topic of topics) {
          this.topics.push({
            name: topic,
            type: this.rosTopicService.getTopicType(topic)
          });
        }
      });

      this.rosServiceService.services.subscribe((services)=>{
        this.services = services;
      });

      this.rosParamService.params.subscribe((params)=>{
        for (let param of params) {
          this.params.push({
            name: param,
            type: this.rosParamService.get(param)
          });
        }
      });

      this.rosNodeService.nodes.subscribe((nodes) => {
        this.nodes = nodes;
      });
  }
}
