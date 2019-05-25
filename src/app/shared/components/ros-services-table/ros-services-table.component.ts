import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { ROSServiceService } from '../../../ros/shared/services/ros-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-ros-services-table',
  templateUrl: './ros-services-table.component.html',
  styleUrls: ['./ros-services-table.component.scss']
})
export class RosServicesTableComponent implements OnInit {

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
  title = 'ROS Service';

  _filter: string[];

  constructor(private rosServiceService: ROSServiceService,
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
    this.data = this.rosServiceService
      .getServiceNames()
      .pipe(
        map((services) => {
          const filtered = [];
          if (this._filter) {
            for (let service of services) {
              if (this._filter.indexOf(service) > -1) {
                filtered.push(service);
              };
            }
            return filtered;
          } else {
            return services;
          }
        }),
        map((services) => {
          const transformed = services.map((service) => {
            return { name: service };
          });
          return transformed;
        })
      );
  }

  onRowClick(event: any) {
    this.router.navigate(['/pages/ros/service/', event.data.name]);
  }

}
