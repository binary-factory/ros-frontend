import { Injectable } from '@angular/core';
import { Observable, Subject, Observer } from 'rxjs';
import { Topic, Message } from 'roslib';
import { ROSService } from './ros.service';
import { AnonymousSubject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class ROSTopicService {

  constructor(private rosService: ROSService) { }

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
      next:(value) => {
        const message = new Message(value);
        topic.publish(message);
      },
      error: (err) => {
        teardown();
      },
      complete:() => {
        teardown();
      }
    };

    return new AnonymousSubject(destination, source);
  }

  get topics() {
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
        console.log(topicType);
        observer.next(topicType);
        observer.complete();
      }, (err) => {
        observer.error(err);
      });
    });
  }
}
