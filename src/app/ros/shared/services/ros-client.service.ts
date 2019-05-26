import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Ros } from 'roslib';
import { BehaviorSubject, Observable, Subject, Subscription, throwError } from 'rxjs';
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

  private heartbeatSub: Subscription;

  constructor(private config: ROSServiceConfig,
              private logger: NGXLogger
  ) {

    this.config = config;

    this.ros = new Ros(config);
    this.ros.callOnConnection = this.sendMessage.bind(this);

    this.resetEventListeners();
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

  getParamObject(type: any) {
    const typeDict = this.getServiceTypeObject(type);
    const iterate = (obj: any) => {
      for (let property in obj) {
        if (obj.hasOwnProperty(property)) {
          if (typeof obj[property] == 'object') {
            iterate(obj[property]);
          }
          else {
            let type: string;
            if (Array.isArray(obj[property])) {
              type = obj[property][0];
            } else {
              type = obj[property];
            }
            type = type.toLowerCase();

            let example: any = '';
            switch (type) {
              case 'string':
                example = '';
                break;
              case 'bool':
                example = false;
                break;
              case 'time':
                let date = new Date();
                example = date.toISOString();
                break;
              case 'byte':
              case 'int8':
              case 'int16':
              case 'int32':
              case 'int64':
              case 'uint8':
              case 'uint16':
              case 'uint32':
              case 'uint64':
                example = 0;
                break;
              case 'float32':
              case 'float64':
                example = 0.0;
                break;
            }

            if (Array.isArray(obj[property])) {
              obj[property][0] = example;
            } else {
              obj[property] = example;
            }
          }
        }
      }
    }
    iterate(typeDict);

    return typeDict;
  }

  getServiceTypeObject(defs: any) {
    const decodeTypeDefsRec = (theType, hints) => {
      const typeDefDict = {};
      for (let i = 0; i < theType.fieldnames.length; i++) {
        const arrayLen = theType.fieldarraylen[i];
        const fieldName = theType.fieldnames[i];
        const fieldType = theType.fieldtypes[i];
        if (fieldType.indexOf('/') === -1) {
          if (arrayLen === -1) {
            typeDefDict[fieldName] = fieldType;
          } else {
            typeDefDict[fieldName] = [fieldType];
          }
        } else {
          let sub = false;
          for (let j = 0; j < hints.length; j++) {
            if (hints[j].type.toString() === fieldType.toString()) {
              sub = hints[j];
              break;
            }
          }
          if (sub) {
            const subResult = decodeTypeDefsRec(sub, hints);
            if (arrayLen === -1) {
              typeDefDict[fieldName] = subResult;
            } else {
              typeDefDict[fieldName] = [subResult];
            }
          } else {
            this.logger.error(`Cannot find ${fieldType} in decodeTypeDefs`);
          }
        }
      }
      return typeDefDict;
    };

    return decodeTypeDefsRec(defs[0], defs);
  }

  private handleHeartbeatTick() {
    this.heartbeatSub = this.heartbeatCheck()
      .subscribe(() => {
        this.logger.trace('Heartbeat successful. Waiting for next one.');
      }, (err) => {
        this.logger.info('Offline due heartbeat error.', err);
        this.isConnected = false;
        this.isConnectedSource$.next(this.isConnected);
        this.stopHeartbeat();
        this.resetEventListeners();
        this.ros.close();
      });
  }

  private sendMessage(message) {
    if (this.isConnected) {
      (this.ros as any).socket.send(JSON.stringify(message));
    } else {
      this.logger.warn('ROS-Client: dropping message.', message);
    }
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
    if (this.heartbeatSub) {
      this.heartbeatSub.unsubscribe();
    }
  }

  private resetEventListeners() {
    this.logger.trace('ROS-Client: resetEventListeners().');
    (this.ros as any).removeAllListeners();
    this.ros.on('connection', this.onConnection.bind(this));
    this.ros.on('close', this.onClose.bind(this));
    this.ros.on('error', this.onError.bind(this));
  }

  private onConnection(event: Event) {
    this.logger.info('ROS-Client: Connected.', event);

    this.resetEventListeners();
    this.isConnected = true;
    this.isConnectedSource$.next(this.isConnected);

    if (this.config.heartbeat > 0) {
      this.logger.info('Starting heartbeat.');
      this.startHeartbeat();
    }
  }

  private onClose(event: CloseEvent) {
    this.logger.info('ROS-Client: Disconnected.', event);

    this.stopHeartbeat();

    this.resetEventListeners();
    this.isConnected = false;
    this.isConnectedSource$.next(this.isConnected);

    setTimeout(() => {
      this.ros.connect(this.config.url);
    }, 0);
  }

  private onError(error: ErrorEvent) {
    this.logger.error('ROS-Error', error);
  }
}