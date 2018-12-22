import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ROSClientService } from './ros-client.service';
import { ROSTopicService } from './ros-topic.service';
import { ROSServiceService } from './ros-service.service';
import { ROSParamService } from './ros-param.service';

import './ros-typings';
import { ROSNodeService } from './ros-node.service';

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
export class ROSModule { }
