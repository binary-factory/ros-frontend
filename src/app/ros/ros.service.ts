import { Injectable } from '@angular/core';
import { ROSServiceConfig } from './ros-config.model';
import { Ros } from 'roslib';

@Injectable({
  providedIn: 'root'
})
export class ROSService {

  private _ros: Ros;

  private _config: ROSServiceConfig;

  constructor(config: ROSServiceConfig) {
    this._config = config;
    this._ros = new Ros(config);
  }

  get instance() {
    return this._ros;
  }

  get config() {
    return this._config;
  }
}
