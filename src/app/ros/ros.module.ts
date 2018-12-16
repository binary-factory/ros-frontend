import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ROSService } from './ros.service';
import { ROSTopicService } from './ros-topic.service';
import { ROSServiceService } from './ros-service.service';
import { ROSParamService } from './ros-param.service';

import './ros-extended';
import { ROSNodeService } from './ros-node.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    ROSService,
    ROSNodeService,
    ROSParamService,
    ROSServiceService,
    ROSTopicService
  ]
})
export class ROSModule { }
