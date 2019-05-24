import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Message, Topic } from 'roslib';
import { Observable, Observer } from 'rxjs';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { ROSDefaultRequestOptions, ROSRequestOptions } from '../models/request-options';
import { ROSRequestResponseOptions } from '../models/request-response-options';
import { ROSClientService } from './ros-client.service';

export interface RosTopicOptions {
  name: string;
  messageType: string;
  compression?: string;
  throttle_rate?: number;
  queue_size?: number;
  latch?: boolean;
  queue_length?: number;
}

let uidCounter = 0;

@Injectable({
  providedIn: 'root'
})
export class ROSTopicService {

  constructor(private _rosClient: ROSClientService,
              private logger: NGXLogger) {
  }

  createTopicSubject<T>(topicOptions: RosTopicOptions, options?: ROSRequestOptions) {

    options = Object.assign(ROSDefaultRequestOptions, options || {});

    const uid = ++uidCounter;

    const topic = new Topic(Object.assign(topicOptions, {
      ros: this._rosClient.instance,
      reconnect_on_close: false
    }));

    // Hack due to bug in roslibjs.
    (topic as any).reconnect_on_close = false;
    (topic as any).callForSubscribeAndAdvertise = (message) => {
      this._rosClient.instance.callOnConnection(message);
    };
    console.log(topic);

    const source = new Observable<T>((observer) => {
      let topicId;

      const callback = (message) => {
        this.logger.trace(`topic[${topicId}] message`);
        observer.next(message as T);
      };

      topic.subscribe(callback);
      topicId = (topic as any).subscribeId;
      this.logger.trace(`topic[${topicId}] subscribed`);

      const connectedSub = this._rosClient.connected$.subscribe((connected) => {
        if (!connected) {
          this.logger.trace(`topic[${topicId}] connection lost`);
          observer.error('connection lost!');
        }
      });

      return () => {
        topic.unsubscribe(callback);
        this.logger.trace(`topic[${topicId}] unsubscribed`);
        connectedSub.unsubscribe();
      };
    });

    const destination: Observer<T> = {
      next: (value) => {
        if (!options.enqueue && !this._rosClient.connected) {
          return;
        }

        const message = new Message(value);
        topic.publish(message);
      },
      error: (error) => {
        topic.unadvertise();
      },
      complete: () => {
        topic.unadvertise();
      }
    };

    return new AnonymousSubject<T>(destination, source);
  }

  getTopicNames(options?: ROSRequestResponseOptions) {
    const source = new Observable<string[]>((observer) => {
      this._rosClient.instance.getTopics((response) => {
        observer.next((<any>response).topics);
        observer.complete();
      }, (err) => {
        observer.error(err);
      });
    });

    return this._rosClient.applyRequestResponseOptions(source, options);
  }


  getTopicType(name: string, options?: ROSRequestResponseOptions) {
    const source = new Observable<string>((observer) => {
      this._rosClient.instance.getTopicType(name, (topicType) => {
        observer.next(topicType);
        observer.complete();
      }, (err) => {
        observer.error(err);
      });
    });

    return this._rosClient.applyRequestResponseOptions(source, options);
  }
}
