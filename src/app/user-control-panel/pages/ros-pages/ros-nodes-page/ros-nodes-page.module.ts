import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { RosNodeInspectPageComponent } from './ros-node-inspect-page/ros-node-inspect-page.component';
import { RosNodesPageComponent } from './ros-nodes-page.component';

@NgModule({
  declarations: [
    RosNodeInspectPageComponent,
    RosNodesPageComponent
  ],
  imports: [
    SharedModule
  ]
})
export class RosNodesPageModule {
}
