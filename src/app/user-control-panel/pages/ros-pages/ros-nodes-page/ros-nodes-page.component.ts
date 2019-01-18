import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ROSNodeService } from '../../../../ros/shared/services/ros-node.service';

@Component({
  selector: 'ngx-ros-nodes-page',
  templateUrl: './ros-nodes-page.component.html',
  styleUrls: ['./ros-nodes-page.component.scss']
})
export class RosNodesPageComponent implements OnInit {
  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>'
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>'
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true
    },
    columns: {
      nodeName: {
        title: 'Name',
        type: 'string',
        editable: false,
      }
    }
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private _rosNodesService: ROSNodeService) {
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  ngOnInit() {
    this._rosNodesService.getNodes({enqueue: true}).subscribe((nodes) => {
      this.source.load(nodes.map(node => {
        return { nodeName: node };
      }));
    });
  }

}
