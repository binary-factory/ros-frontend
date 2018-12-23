import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { Message, Topic } from 'roslib';
import { ROSClientService } from './ros-client.service';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { ROSRequestResponseOptions } from '../models/request-response-options';
import { ROSDefaultRequestOptions, ROSRequestOptions } from '../models/request-options';

@Injectable({
  providedIn: 'root'
})
export class ROSTopicService {

  constructor(private _rosClient: ROSClientService) {
  }

  createTopicSubject<T>(topicOptions: {
    name: string,
    messageType: string,
    compression?: string,
    throttle_rate?: number,
    queue_size?: number,
    latch?: boolean,
    queue_length?: number
  }, options?: ROSRequestOptions) {

    options = Object.assign(ROSDefaultRequestOptions, options || {});

    const topic = new Topic(Object.assign(topicOptions, {ros: this._rosClient.instance}));

    const source = new Observable<T>((observer) => {
      topic.subscribe((message) => {
        observer.next(message as T);
      });

      const sub = this._rosClient.connected$.subscribe((connected) => {
        if (!connected) {
          observer.error('connection lost!');
        }
      });

      return () => {
        sub.unsubscribe();
      };
    });

    const teardown = () => {
      topic.unsubscribe();
      topic.unadvertise();
    };

    const destination: Observer<T> = {
      next: (value) => {
        const message = new Message(value);
        if (!options.enqueue && !this._rosClient.connected) {
          return;
        }

        topic.publish(message);
      },
      error: (err) => {
        teardown();
      },
      complete: () => {
        teardown();
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
        console.log(topicType);
        observer.next(topicType);
        observer.complete();
      }, (err) => {
        observer.error(err);
      });
    });

    return this._rosClient.applyRequestResponseOptions(source, options);
  }
}
