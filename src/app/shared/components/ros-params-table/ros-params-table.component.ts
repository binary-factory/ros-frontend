import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { concatMap, map, reduce } from 'rxjs/operators';
import { ROSParamService } from '../../../ros/shared/services/ros-param.service';

@Component({
  selector: 'ngx-ros-params-table',
  templateUrl: './ros-params-table.component.html',
  styleUrls: ['./ros-params-table.component.scss']
})
export class RosParamsTableComponent implements OnInit {

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
      name: {
        title: 'Name',
        type: 'string',
        editable: false
      },
      value: {
        title: 'Wert',
        type: 'string',
        editable: true
      }
    }
  };

  data: Observable<Array<any>>;

  constructor(private rosParamService: ROSParamService) {
  }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.data = this.rosParamService
      .getParamNames()
      .pipe(
        concatMap<string[], string>((x) => x),
        concatMap((param) => {
          return this.rosParamService.getParam(param).pipe(map((value) => {
            return { name: param, value };
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
