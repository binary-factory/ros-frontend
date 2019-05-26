import { Component, OnInit, OnDestroy } from '@angular/core';
import { ROSTopicService, RosTopicOptions } from '../../../../ros/shared/services/ros-topic.service';
import { timer, Subscription } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { stat } from 'fs';
import { retryWhen, tap, take, filter, mergeMap } from 'rxjs/operators';
import { ROSClientService } from '../../../../ros/shared/services/ros-client.service';

@Component({
  selector: 'ngx-supersonic-sensor',
  templateUrl: './supersonic-sensor.component.html',
  styleUrls: ['./supersonic-sensor.component.scss']
})
export class SupersonicSensorComponent implements OnInit, OnDestroy {

  sensorArray: any[];

  obstacles: any[] = [];

  obstacleTopic: AnonymousSubject<any>;

  disableTopic: AnonymousSubject<any>;

  sub: Subscription;

  constructor(private rosTopicService: ROSTopicService,
    private rosClientService: ROSClientService) { }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  ngOnInit() {
    this.createSensorArray();
  
    this.obstacleTopic = this.rosTopicService.createTopicSubject(environment.sensorObstacleTopic);
    
    this.disableTopic = this.rosTopicService.createTopicSubject(environment.sensorDisableTopic);
    
    this.sub = this.obstacleTopic
    .pipe(
      retryWhen((errors) => {
        return errors.pipe(
          tap((error) => {
            //this.onTopicError(error);
          }),
          take(1),
          mergeMap(() => {
            return this.rosClientService.connected$;
          }),
          filter((connected) => {
            return connected === true;
          }),
          tap((connected) => {
            //this.logger.trace('Connected! Retry!');
          })
        );
      })
    )
    .subscribe((obstacles) => {
      this.obstacles = obstacles.data;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  createSensorArray() {
    this.sensorArray = [];
    for (let i = 0; i < 8; i++) {
      this.sensorArray.push([i, 1]);
    }
  }

  getSensorRowById(sensorId: number) {
    for (let i = 0; i < this.sensorArray.length; i++) {
      const sensor = this.sensorArray[i];
      if (sensor[0] === sensorId) {
        return i;
      }
    }
  }

  isSensorDisabled(sensorId: number) {
    return this.sensorArray[this.getSensorRowById(sensorId)][1] === 0;
  }

  isSensorTriggered(sensorId: number) {
    return this.obstacles.includes(sensorId);
  }

  toggleSensor(sensorId: number) {
    const row = this.getSensorRowById(sensorId);
    const disabled = this.sensorArray[row][1] === 0;
    if (disabled) {
      this.sensorArray[row][1] = 1;
    } else {
      this.sensorArray[row][1] = 0;
    }
    const data = [];
    for (let row = 0; row < this.sensorArray.length; row++) {
      const sensor = this.sensorArray[row][0];
      const status = this.sensorArray[row][1];
      data.push(sensor);
      data.push(status);
    }
    const message = {
      "layout": {
        "dim": [
          {
            "label": "columns",
            "size": this.sensorArray.length,
            "stride": this.sensorArray.length * 2
          },
          {
            "label": "row",
            "size": 2,
            "stride": 2
          }
        ],
        "data_offset": 0
      },
      "data": data
    };
    this.disableTopic.next(message);
  }
}
