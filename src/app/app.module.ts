import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxLoadingModule } from 'ngx-loading';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { GamepadModule } from './gamepad/gamepad.module';
import { ROSModule } from './ros/ros.module';
import { ThemeModule } from './theme/theme.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,

    CoreModule.forRoot(),
    ThemeModule.forRoot(),
    ROSModule.forRoot({ url: 'ws://192.168.0.141:9090' }),
    GamepadModule.forRoot(),
    NgxLoadingModule.forRoot({
      primaryColour: '#00d9bf',
      secondaryColour: '#00d977',
      tertiaryColour: '#2f296b'
    })
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' }
  ]
})
export class AppModule {
}
