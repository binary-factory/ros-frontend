import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ROSNodeService } from '../../../ros/shared/services/ros-node.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-ros-nodes-table',
  templateUrl: './ros-nodes-table.component.html',
  styleUrls: ['./ros-nodes-table.component.scss']
})
export class RosNodesTableComponent implements OnInit {

  settings = {
    actions: false,
    columns: {
      name: {
        title: 'Name',
        type: 'string',
        editable: false
      }
    }
  };

  data: Observable<Array<any>>;

  @Input()
  title = 'ROS Nodes';

  @Input()
  _filter: string[];

  constructor(private rosNodeService: ROSNodeService,
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
    this.data = this.rosNodeService
      .getNodes()
      .pipe(
        map((services) => {
          const filtered = [];
          if (this._filter) {
            for (let service of services) {
              if (this._filter.indexOf(service) > -1) {
                filtered.push(service);
              };
            }
            return filtered
          } else {
            return services;
          }
        }),
        map((nodes) => {
          const transformed = nodes.map((node) => {
            return { name: node };
          });
          return transformed;
        })
      );
  }

  onRowClick(event: any) {
    this.router.navigate(['/pages/ros/node/', event.data.name]);
  }
}
