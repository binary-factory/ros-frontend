import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { concatMap, map, reduce } from 'rxjs/operators';
import { ROSTopicService } from '../../../ros/shared/services/ros-topic.service';

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

  constructor(private rosTopicService: ROSTopicService) {
  }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.data = this.rosTopicService
      .getTopicNames()
      .pipe(
        concatMap<string[], string>((x) => x),
        concatMap((topic) => {
          return this.rosTopicService.getTopicType(topic).pipe(map((type) => {
            return { name: topic, type };
          }));
        }),
        reduce<any, any[]>((array, value) => {
          array.push(value);
          return array;
        }, [])
      );
  }

  onRowClick(event: any) {
    console.log(event);
  }

}
