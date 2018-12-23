import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ROSClientService } from './shared/services/ros-client.service';
import { ROSTopicService } from './shared/services/ros-topic.service';
import { ROSServiceService } from './shared/services/ros-service.service';
import { ROSParamService } from './shared/services/ros-param.service';

import './ros-typings';
import { ROSNodeService } from './shared/services/ros-node.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    ROSClientService,
    ROSNodeService,
    ROSParamService,
    ROSServiceService,
    ROSTopicService
  ]
})
export class ROSModule {
}
