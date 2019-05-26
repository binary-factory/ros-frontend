import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { RosParamsPageComponent } from './ros-params-page.component';

@NgModule({
  declarations: [
    RosParamsPageComponent
  ],
  imports: [
    SharedModule
  ]
})
export class RosParamsPageModule {
}
