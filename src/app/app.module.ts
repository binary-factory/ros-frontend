import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { Ros } from 'roslib';
import { ROSModule } from './ros/ros.module';
import { ROSServiceConfig } from './ros/ros-config.model';
import { GamepadModule } from './gamepad/gamepad.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ROSModule,
    GamepadModule
  ],
  providers: [
    {
      provide: ROSServiceConfig,
      useValue: {
        url: 'ws://192.168.0.34:9090'
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  ros: Ros;

  constructor() {
  }
}
