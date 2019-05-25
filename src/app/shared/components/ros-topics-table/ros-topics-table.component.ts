import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { concatMap, map, reduce, filter } from 'rxjs/operators';
import { ROSTopicService } from '../../../ros/shared/services/ros-topic.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-ros-topics-table',
  templateUrl: './ros-topics-table.component.html',
  styleUrls: ['./ros-topics-table.component.scss']
})
export class RosTopicsTableComponent implements OnInit {

  settings = {
    actions: false,
    columns: {
      name: {
        title: 'Name',
        type: 'string',
        editable: false
      },
      type: {
        title: 'Type',
        type: 'string',
        editable: false
      }
    }
  };

  data: Observable<Array<any>>;

  @Input()
  title = 'ROS Topics';

  @Input()
  _filter: string[];

  constructor(private rosTopicService: ROSTopicService,
    private router: Router) {
  }

  ngOnInit() {
    this.refresh();
  }

  @Input()
  set filter(filterVal: string[]) {
    this._filter = filterVal;
    this.refresh();
  }


  refresh() {
    this.data = this.rosTopicService
      .getTopicNames()
      .pipe(
        concatMap<string[], string>((x) => x),
        filter((topic) => {
          if (this._filter) {
            return this._filter.indexOf(topic) > -1;
          } else {
            return true;
          }
        }),
        concatMap((topic) => {
          return this.rosTopicService
            .getTopicType(topic)
            .pipe(
              map((type) => {
                return { name: topic, type };
              })
            );
        }),
        reduce<any, any[]>((array, value) => {
          array.push(value);
          return array;
        }, [])
      );
  }

  onRowClick(event: any) {
    this.router.navigate(['/pages/ros/topic/', event.data.name]);
  }

}
