import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { Ros } from 'roslib';
import { ROSModule } from './ros/ros.module';
import { ROSServiceConfig } from './ros/ros-config.model';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ROSModule
  ],
  providers: [
    {
      provide: ROSServiceConfig,
      useValue: {
        url: 'ws://172.18.178.214:9090'
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
