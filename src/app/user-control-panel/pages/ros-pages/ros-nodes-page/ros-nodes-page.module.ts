import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { RosNodeInspectPageComponent } from './ros-node-inspect-page/ros-node-inspect-page.component';
import { RosNodesPageComponent } from './ros-nodes-page.component';
import { RosNodeGraphComponent } from './ros-node-graph/ros-node-graph.component';

@NgModule({
  declarations: [
    RosNodeInspectPageComponent,
    RosNodesPageComponent,
    RosNodeGraphComponent
  ],
  imports: [
    SharedModule
  ]
})
export class RosNodesPageModule {
}
