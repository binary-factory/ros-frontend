import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import './ros-typings';
import { ROSClientService } from './shared/services/ros-client.service';
import { ROSNodeService } from './shared/services/ros-node.service';
import { ROSParamService } from './shared/services/ros-param.service';
import { ROSServiceService } from './shared/services/ros-service.service';
import { ROSTopicService } from './shared/services/ros-topic.service';

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
