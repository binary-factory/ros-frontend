import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { RosServiceInspectPageComponent } from './ros-service-inspect-page/ros-service-inspect-page.component';
import { RosServicesPageComponent } from './ros-services-page.component';

@NgModule({
  declarations: [
    RosServiceInspectPageComponent,
    RosServicesPageComponent
  ],
  imports: [
    SharedModule
  ]
})
export class RosServicesPageModule {
}
