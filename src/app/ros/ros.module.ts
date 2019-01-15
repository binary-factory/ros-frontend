import { ModuleWithProviders, NgModule } from '@angular/core';

import './ros-typings';
import './three-extended-typings';

import { RosPointCloudComponent } from './shared/components/ros-point-cloud/ros-point-cloud.component';
import { RosViewerComponent } from './shared/components/ros-viewer/ros-viewer.component';
import { ROSServiceConfig } from './shared/models/ros-config.model';
import { ROSClientService } from './shared/services/ros-client.service';
import { ROSNodeService } from './shared/services/ros-node.service';
import { ROSParamService } from './shared/services/ros-param.service';
import { ROSServiceService } from './shared/services/ros-service.service';
import { ROSTopicService } from './shared/services/ros-topic.service';

@NgModule({
  declarations: [RosPointCloudComponent, RosViewerComponent],
  imports: [],
  providers: [],
  exports: [
    RosPointCloudComponent
  ]
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
