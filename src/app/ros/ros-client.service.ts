import { Injectable } from '@angular/core';
import { ROSServiceConfig } from './ros-config.model';
import { Ros } from 'roslib';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ROSRequestOptions, ROSDefaultRequestOptions } from './models/request-options';
import { ROSRequestResponseOptions, ROSDefaultRequestResponseOptions } from './models/request-response-options';
import { timeout } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ROSClientService {

  private _ros: Ros;

  private _config: ROSServiceConfig;

  private _connected: boolean;

  private _connectedSource$ = new BehaviorSubject<boolean>(false);

  constructor(config: ROSServiceConfig) {
    this._config = config;
    this._ros = new Ros(config);

    this._ros.on('connection', this._handleConnection.bind(this));
    this._ros.on('close', this._handleClose.bind(this));
    this._ros.on('error', this._handleError.bind(this));
  }

  private _handleConnection(event: Event) {
    console.info('ROS-Client: Connected.', event);
    this._connected = true;
    this._connectedSource$.next(this._connected);
  }

  private _handleClose(event: CloseEvent) {
    console.info('ROS-Client: Disconnected.', event);
    this._connected = false;
    this._connectedSource$.next(this._connected);
  }

  private _handleError(err: ErrorEvent) {
    console.log('ROS-Error', err);
  }

  get instance() {
    return this._ros;
  }

  get config() {
    return this._config;
  }

  get connected() {
    return this._connected;
  }

  get connected$() {
    return this._connectedSource$.asObservable();
  }

  applyRequestOptions<T>(source: Observable<T> | Subject<T>, options?: ROSRequestOptions) {
    options = Object.assign(ROSDefaultRequestOptions, options || {});
    if (!this.connected && !options.enqueue) {
      return throwError('you are not connected! Enque was disabled for this request.');
    } else {
      return source;
    }
  }

  applyRequestResponseOptions<T>(source: Observable<T> | Subject<T>, options?: ROSRequestResponseOptions) {
    options = Object.assign(ROSDefaultRequestResponseOptions, options || {});
    source = this.applyRequestOptions(source, options);

    if (options.timeout > 0) {
      return source.pipe(timeout(options.timeout));
    } else {
      return source;
    }
  }
}
