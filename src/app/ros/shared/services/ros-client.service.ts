import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Ros } from 'roslib';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { ROSDefaultRequestOptions, ROSRequestOptions } from '../models/request-options';
import { ROSDefaultRequestResponseOptions, ROSRequestResponseOptions } from '../models/request-response-options';
import { ROSServiceConfig } from '../models/ros-config.model';

@Injectable({
  providedIn: 'root'
})
export class ROSClientService {

  private readonly ros: Ros;

  private readonly config: ROSServiceConfig;

  private isConnected: boolean;

  private isConnectedSource$ = new BehaviorSubject<boolean>(false);

  constructor(config: ROSServiceConfig, private logger: NGXLogger) {
    this.config = config;
    this.ros = new Ros(config);

    this.ros.on('connection', this._handleConnection.bind(this));
    this.ros.on('close', this._handleClose.bind(this));
    this.ros.on('error', this.handleError.bind(this));
  }

  get instance() {
    return this.ros;
  }

  get connected() {
    return this.isConnected;
  }

  get connected$() {
    return this.isConnectedSource$.asObservable();
  }

  applyRequestOptions<T>(source: Observable<T> | Subject<T>, options?: ROSRequestOptions) {
    options = Object.assign(ROSDefaultRequestOptions, options || {});
    if (!this.isConnected && !options.enqueue) {
      return throwError('You are not isConnected! Enque was disabled for this request.');
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

  private _handleConnection(event: Event) {
    this.logger.info('ROS-Client: Connected.', event);
    this.isConnected = true;
    this.isConnectedSource$.next(this.isConnected);
  }

  private _handleClose(event: CloseEvent) {
    this.logger.info('ROS-Client: Disconnected.', event);
    this.isConnected = false;
    this.isConnectedSource$.next(this.isConnected);
  }

  private handleError(err: ErrorEvent) {
    this.logger.error('ROS-Error', err);
  }
}
