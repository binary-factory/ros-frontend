import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ROSNodeService } from '../../../ros/shared/services/ros-node.service';

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

  constructor(private rosNodeService: ROSNodeService) {
  }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    /*
    this.rosNodeService
      .getNodes({ enqueue: true })
      .pipe(
        concatMap(x => x as string),
        mergeMap((nodeName) => this.rosNodeService.getNodeDetails(nodeName)),
        reduce((array, nodeDetails) => {
          array.push(nodeDetails);
          return array;
        }, [])
      )
      .subscribe((nodeDetails) => {
        this.source.load(nodeDetails);
        console.log(nodeDetails);
      })
      .add(() => {
        this.isLoading = false;
      });
      */
    this.data = this.rosNodeService
      .getNodes()
      .pipe(
        map((nodes) => {
          const transformed = nodes.map((node) => {
            return { name: node };
          });
          return transformed;
        })
      );
  }

  onRowClick(event: any) {
    console.log(event);
  }
}
