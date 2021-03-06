import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';


import { DashboardPageComponent } from './dashboard-page.component';
import { PointCloudSettingsComponent } from './point-cloud-settings/point-cloud-settings.component';
import { PointCloudComponent } from './point-cloud/point-cloud.component';
import { VideoComponent } from './video/video.component';
import { BatteryComponent } from './battery/battery.component';
import { SupersonicSensorComponent } from './supersonic-sensor/supersonic-sensor.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    DashboardPageComponent,
    VideoComponent,
    BatteryComponent,
    PointCloudComponent,
    PointCloudSettingsComponent,
    SupersonicSensorComponent
  ],
  entryComponents: [
    PointCloudSettingsComponent
  ]
})
export class DashboardPageModule {
}
