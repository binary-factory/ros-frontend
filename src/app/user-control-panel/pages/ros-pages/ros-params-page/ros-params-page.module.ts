import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { RosParamInspectPageComponent } from './ros-param-inspect-page/ros-param-inspect-page.component';

import { RosParamsPageComponent } from './ros-params-page.component';

@NgModule({
  declarations: [
    RosParamsPageComponent,
    RosParamInspectPageComponent
  ],
  imports: [
    SharedModule
  ]
})
export class RosParamsPageModule {
}
