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

  private isConnected: boolean;

  private isConnectedSource$ = new BehaviorSubject<boolean>(false);

  private heartbeatTimer: any;

  constructor(private config: ROSServiceConfig,
              private logger: NGXLogger
  ) {

    this.config = config;
    this.ros = new Ros(config);

    this.ros.on('connection', this.handleConnection.bind(this));
    this.ros.on('close', this.handleClose.bind(this));
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
      return throwError('You are not connected! Enqueue was disabled for this request.');
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

  private handleHeartbeatTick() {
    let connected = false;
    this.heartbeatCheck()
      .subscribe(() => {
        this.logger.info('Heartbeat successful. Waiting for next one.');
        connected = true;
      }, (err) => {
        this.logger.info('Offline due heartbeat error.', err);
        connected = false;

      })
      .add(() => {
        if (this.isConnected !== connected) {
          this.logger.info('Connection state changed.');
          this.isConnected = connected;
          this.isConnectedSource$.next(this.isConnected);
        }
      });
  }

  private heartbeatCheck() {
    const source = new Observable((observer) => {
      this.ros.getNodes((nodes) => {
        observer.next();
        observer.complete();
      }, (err) => {
        observer.error(err);
      });
    });

    return source.pipe(timeout(this.config.heartbeat));
  }

  private startHeartbeat() {
    this.heartbeatTimer = setInterval(this.handleHeartbeatTick.bind(this), this.config.heartbeat);
  }

  private stopHeartbeat() {
    clearInterval(this.heartbeatTimer);
  }

  private handleConnection(event: Event) {
    this.logger.info('ROS-Client: Connected.', event);
    this.isConnected = true;
    this.isConnectedSource$.next(this.isConnected);

    if (this.config.heartbeat > 0) {
      this.logger.info('Starting heartbeat.');
      this.startHeartbeat();
    }
  }

  private handleClose(event: CloseEvent) {
    this.logger.info('ROS-Client: Disconnected.', event);
    this.isConnected = false;
    this.isConnectedSource$.next(this.isConnected);

    this.stopHeartbeat();

    setTimeout(() => {
      this.ros.connect(this.config.url);
    }, 0);
  }

  private handleError(err: ErrorEvent) {
    this.logger.error('ROS-Error', err);
  }
}
