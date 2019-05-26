import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RosNodeInspectPageComponent } from './ros-nodes-page/ros-node-inspect-page/ros-node-inspect-page.component';

import { RosNodesPageComponent } from './ros-nodes-page/ros-nodes-page.component';
import { RosParamsPageComponent } from './ros-params-page/ros-params-page.component';
import { RosServiceInspectPageComponent } from './ros-services-page/ros-service-inspect-page/ros-service-inspect-page.component';
import { RosServicesPageComponent } from './ros-services-page/ros-services-page.component';
import { RosTopicInspectPageComponent } from './ros-topics-page/ros-topic-inspect-page/ros-topic-inspect-page.component';
import { RosTopicsPageComponent } from './ros-topics-page/ros-topics-page.component';

const routes: Routes = [
  { path: 'nodes', component: RosNodesPageComponent },
  { path: 'node/:id', component: RosNodeInspectPageComponent },
  { path: 'params', component: RosParamsPageComponent },
  { path: 'services', component: RosServicesPageComponent },
  { path: 'service/:id', component: RosServiceInspectPageComponent },
  { path: 'topics', component: RosTopicsPageComponent },
  { path: 'topic/:id', component: RosTopicInspectPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RosPagesRoutingModule {
}
