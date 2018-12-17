import { Injectable } from '@angular/core';
import { Observable, Subject, Observer } from 'rxjs';
import { Topic, Message } from 'roslib';
import { ROSService } from './ros.service';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { ROSClientService } from './rosclient.service';

@Injectable({
  providedIn: 'root'
})
export class ROSTopicService {

  constructor(private _rosClient: ROSClientService, private rosService: ROSService) { }

  create(options: {
    name: string,
    messageType: string,
    compression?: string,
    throttle_rate?: number,
    queue_size?: number,
    latch?: boolean,
    queue_length?: number
  }) {

    const topic = new Topic(Object.assign(options, { ros: this.rosService.instance }));
    const source: Observable<Message> = new Observable((observer) => {
      topic.subscribe((message) => {
        observer.next(message);
      });
    });

    const teardown = () => {
      topic.unsubscribe();
      topic.unadvertise();
    };

    const destination: Observer<Message> = {
      next: (value) => {
        const message = new Message(value);
        topic.publish(message);
      },
      error: (err) => {
        teardown();
      },
      complete: () => {
        teardown();
      }
    };

    return new AnonymousSubject(destination, source);
  }

  get topics() {

    const param = {
      linear: {
        x: 0.1,
        y: 0.2,
        z: 0.3
      },
      angular: {
        x: -0.1,
        y: -0.2,
        z: -0.3
      }
    };
    const sub = this._rosClient.transceive({ "op": "publish", "id": "test", "topic": "/turtle1/cmd_vel", "type": "geometry_msgs/Twist", "msg": param }).subscribe((response) => {
      console.log('response', response);
    }, (err) => {
      console.log('err', err);
    }, () => {
      console.log('complete');
    });
    this._rosClient.messages$.subscribe((message) => {
      console.log(message);
    });

    return new Observable<string[]>((observer) => {
      this.rosService.instance.getTopics((response) => {
        observer.next((<any>response).topics);
        observer.complete();
      }, (err) => {
        observer.error(err);
      });
    });

  }


  getTopicType(name: string) {
    return new Observable<string>((observer) => {
      this.rosService.instance.getTopicType(name, (topicType) => {
        observer.next(topicType);
        observer.complete();
      }, (err) => {
        observer.error(err);
      });
    });
  }
}
