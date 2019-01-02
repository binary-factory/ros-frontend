import { ModuleWithProviders, NgModule } from '@angular/core';

import './ros-typings';
import { ROSServiceConfig } from './shared/models/ros-config.model';
import { ROSClientService } from './shared/services/ros-client.service';
import { ROSNodeService } from './shared/services/ros-node.service';
import { ROSParamService } from './shared/services/ros-param.service';
import { ROSServiceService } from './shared/services/ros-service.service';
import { ROSTopicService } from './shared/services/ros-topic.service';

@NgModule({
  declarations: [],
  imports: [],
  providers: []
})
export class ROSModule {
  static forRoot(config?: ROSServiceConfig): ModuleWithProviders {
    return {
      ngModule: ROSModule,
      providers: [
        { provide: ROSServiceConfig, useValue: config || {} },
        ROSClientService,
        ROSNodeService,
        ROSParamService,
        ROSServiceService,
        ROSTopicService
      ]
    };
  }
}
