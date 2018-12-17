import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ROSService } from './ros.service';
import { ROSTopicService } from './ros-topic.service';
import { ROSServiceService } from './ros-service.service';

import './ros-extended';
import { ROSNodeService } from './ros-node.service';
import { ROSClientService } from './rosclient.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    ROSClientService,
    ROSService,
    ROSNodeService,
    ROSParamService,
    ROSServiceService,
    ROSTopicService
  ]
})
export class ROSModule { }
