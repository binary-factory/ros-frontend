import { NgModule } from '@angular/core';

import { NgxEchartsModule } from 'ngx-echarts';

import { ThemeModule } from '../../@theme/theme.module';
import { DashboardComponent } from './dashboard.component';
import { SecurityCamerasComponent } from './security-cameras/security-cameras.component';
import { SolarComponent } from './solar/solar.component';

@NgModule({
  imports: [
    ThemeModule,
    NgxEchartsModule
  ],
  declarations: [
    DashboardComponent,
    SecurityCamerasComponent,
    SolarComponent
  ]
})
export class DashboardModule {
}
