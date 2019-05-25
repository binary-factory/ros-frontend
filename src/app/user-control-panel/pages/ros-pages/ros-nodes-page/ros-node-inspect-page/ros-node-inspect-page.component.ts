import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { ROSNodeDetails } from '../../../../../ros/shared/models/node-details.model';
import { ROSNodeService } from '../../../../../ros/shared/services/ros-node.service';

@Component({
  selector: 'ngx-ros-node-inspect-page',
  templateUrl: './ros-node-inspect-page.component.html',
  styleUrls: ['./ros-node-inspect-page.component.scss']
})
export class RosNodeInspectPageComponent implements OnInit {

  nodeDetails: Observable<ROSNodeDetails>;

  node: any;

  subscriptions: string[] = [];

  publications: string[] = [];

  services: string[] = [];
  
  constructor(private route: ActivatedRoute, private rosNodeService: ROSNodeService) {
  }

  ngOnInit() {
    this.nodeDetails = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.rosNodeService.getNodeDetails(params.get('id'), { enqueue: true });
      })
    );

    this.nodeDetails.pipe(take(1)).subscribe((details) => {
      console.log(details)
      this.node = details;
      this.subscriptions = details.subscriptions;
      this.publications = details.publications;
      this.services = details.services;
      console.log(details);
    });
  }

}
