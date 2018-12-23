import { NgModule } from '@angular/core';


import { DashboardComponent } from './dashboard.component';
import { SecurityCamerasComponent } from './security-cameras/security-cameras.component';
import { SolarComponent } from './solar/solar.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    DashboardComponent,
    SecurityCamerasComponent,
    SolarComponent
  ]
})
export class DashboardModule {
}
