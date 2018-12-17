import { Injectable, Optional } from '@angular/core';
import { WebSocketSubject, WebSocketSubjectConfig, webSocket } from 'rxjs/webSocket';
import { NextObserver, BehaviorSubject, Observable, PartialObserver, Subscriber } from 'rxjs';
import { retry, filter, timeout } from 'rxjs/operators';
import { ROSMessage } from './models/ros-message';
import { ROSServiceConfig } from './ros-config.model';
import { ROSServiceDefaultConfig } from './ros-default-config';


// TODO: PNG / Fragmentation
@Injectable({
  providedIn: 'root'
})
export class ROSClientService {

  _id = 0;

  _config: ROSServiceConfig;

  _websocket: WebSocketSubject<ROSMessage>;

  _connected: boolean;

  _connectedSource = new BehaviorSubject<boolean>(false);

  constructor(@Optional() config : ROSServiceConfig) {
    this._config = Object.assign(ROSServiceDefaultConfig, config);
    console.log('ROS-Client-Config', this._config);

    const openObserver: NextObserver<Event> = {
      next: (event) => {
        this._handleWebSocketOpen(event);
      }
    };
    const closeObserver: NextObserver<CloseEvent> = {
      next: (event) => {
        this._handleWebSocketClose(event);
      }
    };

    const webSocketConfig: WebSocketSubjectConfig<ROSMessage> = {
      url: this._config.url,
      openObserver,
      closeObserver
    }
    this._websocket = new WebSocketSubject<ROSMessage>(webSocketConfig);
  }

  private _handleWebSocketOpen(event: Event) {
    this._connected = true;
    this._connectedSource.next(this._connected);
  }

  private _handleWebSocketClose(event: CloseEvent) {
    this._connected = false;
    this._connectedSource.next(this._connected);
  }

  private get _nextId() {
    return this._id++;
  }

  send(message: ROSMessage, queue: boolean = true) {
    if (!this._connected && !queue) {
      return false;
    }

    this._websocket.next(message);
    return true;
  }

  transceive<T extends ROSMessage, R extends ROSMessage>(message: T, queue: boolean = true, responseTimeout: number = this._config.defaultTimeout) {
    return new Observable<R>((observer) => {
      if (!this._connected && !queue) {
        return observer.error(new Error('not connected and no queue activated.'));
      }

      const messageId = this._nextId;
      let source = this.messages$.pipe(filter(message => message.id === messageId));
      if (responseTimeout > 0) {
        source = source.pipe(timeout(responseTimeout));
      }
      const sub = source.subscribe(observer);

      this._websocket.next(message);

      return () => {
        sub.unsubscribe();
      }
    });
  }

  get messages$() {
    return this._websocket.pipe(retry());
  }

  get connected() {
    return this._connected;
  }

  get connected$() {
    return this._connectedSource.asObservable();
  }
}
