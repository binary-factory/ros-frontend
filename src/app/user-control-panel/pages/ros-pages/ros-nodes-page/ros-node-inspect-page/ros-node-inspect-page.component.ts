import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ROSNodeDetails } from '../../../../../ros/shared/models/node-details.model';
import { ROSNodeService } from '../../../../../ros/shared/services/ros-node.service';

@Component({
  selector: 'ngx-ros-node-inspect-page',
  templateUrl: './ros-node-inspect-page.component.html',
  styleUrls: ['./ros-node-inspect-page.component.scss']
})
export class RosNodeInspectPageComponent implements OnInit {

  nodeDetails: Observable<ROSNodeDetails>;

  constructor(private route: ActivatedRoute, private rosNodeService: ROSNodeService) {
  }

  ngOnInit() {
    this.nodeDetails = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        console.log(params.get('id'));
        return this.rosNodeService.getNodeDetails(params.get('id'), { enqueue: true });
      })
    );

    this.nodeDetails.subscribe((details) => console.log(details));
  }

}
