import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';


import { DashboardPageComponent } from './dashboard-page.component';
import { PointCloudComponent } from './point-cloud/point-cloud.component';
import { SecurityCamerasComponent } from './security-cameras/security-cameras.component';
import { SolarComponent } from './solar/solar.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    DashboardPageComponent,
    SecurityCamerasComponent,
    SolarComponent,
    PointCloudComponent
  ]
})
export class DashboardPageModule {
}