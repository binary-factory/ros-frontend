import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { RosTopicInspectPageComponent } from './ros-topic-inspect-page/ros-topic-inspect-page.component';

import { RosTopicsPageComponent } from './ros-topics-page.component';

@NgModule({
  declarations: [
    RosTopicsPageComponent,
    RosTopicInspectPageComponent
  ],
  imports: [
    SharedModule
  ]
})
export class RosTopicsPageModule {
}
