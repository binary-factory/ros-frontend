import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ROSServiceService } from '../../../ros/shared/services/ros-service.service';

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

  constructor(private rosServiceService: ROSServiceService) {
  }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.data = this.rosServiceService
      .getServiceNames()
      .pipe(
        map((services) => {
          const transformed = services.map((service) => {
            return { name: service };
          });
          return transformed;
        })
      );
  }

  onRowClick(event: any) {
    console.log(event);
  }

}
