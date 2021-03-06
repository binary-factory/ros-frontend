import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { filter, mergeMap, retryWhen, take, tap } from 'rxjs/operators';
import { ROSClientService } from '../../../ros/shared/services/ros-client.service';
import { ROSTopicService } from '../../../ros/shared/services/ros-topic.service';
import { GamepadService } from '../../../gamepad/gamepad.service';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard-page.component.scss'],
  templateUrl: './dashboard-page.component.html'
})
export class DashboardPageComponent implements OnDestroy, OnInit {

  v12Percentage: number = 0;
  v24Percentage: number = 0;

  battery12VSub: Subscription;
  battery24VSub: Subscription;

  constructor(private themeService: NbThemeService,
    private rosTopicService: ROSTopicService,
    private rosClientService: ROSClientService,
    private gamepadService: GamepadService) {
  }

  ngOnInit(): void {
    this.battery12VSub = this.rosTopicService.createTopicSubject(environment.batteryTopic12v)
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
      ).subscribe((level: any) => {
        let percentage = level.data / 255;
        this.v12Percentage = Math.floor(percentage * 100);
      });


    this.battery24VSub = this.rosTopicService.createTopicSubject(environment.batteryTopic24v)
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
      ).subscribe((level: any) => {
        let percentage = level.data / 255;
        this.v24Percentage = Math.floor(percentage * 100);
      });

    this.gamepadService.enable();
  }

  ngOnDestroy() {
    this.battery12VSub.unsubscribe();
    this.battery24VSub.unsubscribe();
    this.gamepadService.disable();
  }
}
