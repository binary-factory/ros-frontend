import { NgModule } from '@angular/core';

import { RosNodesPageModule } from './ros-nodes-page/ros-nodes-page.module';
import { RosPagesRoutingModule } from './ros-pages-routing.module';
import { RosParamsPageModule } from './ros-params-page/ros-params-page.module';
import { RosServicesPageModule } from './ros-services-page/ros-services-page.module';
import { RosTopicsPageModule } from './ros-topics-page/ros-topics-page.module';

@NgModule({
  declarations: [],
  imports: [
    RosNodesPageModule,
    RosParamsPageModule,
    RosServicesPageModule,
    RosTopicsPageModule,
    RosPagesRoutingModule
  ]
})
export class RosPagesModule {
}
