import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { concatMap, map, reduce } from 'rxjs/operators';
import { ROSParamService } from '../../../ros/shared/services/ros-param.service';
import { LocalDataSource } from 'ng2-smart-table';
import { NbToastrService } from '@nebular/theme';

const { convertStringToNumber } = require('convert-string-to-number');

@Component({
  selector: 'ngx-ros-params-table',
  templateUrl: './ros-params-table.component.html',
  styleUrls: ['./ros-params-table.component.scss']
})
export class RosParamsTableComponent implements OnInit, OnDestroy {

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
      confirmDelete: false
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

  data: Observable<any>;

  source: LocalDataSource = new LocalDataSource();

  private subAdded: Subscription;

  private subRemoved: Subscription;

  private subUpdate: Subscription;

  constructor(private rosParamService: ROSParamService,
    private toastService: NbToastrService) {
  }

  ngOnInit() {
    this.subAdded = this.source.onAdded().subscribe(this.handleAdded.bind(this));
    this.subRemoved = this.source.onRemoved().subscribe(this.handleDelete.bind(this));
    this.subUpdate = this.source.onUpdated().subscribe(this.handleUpdate.bind(this));

    this.refresh();
  }

  ngOnDestroy(): void {
    this.subAdded.unsubscribe();
    this.subRemoved.unsubscribe();
    this.subUpdate.unsubscribe();
  }

  refresh() {

    this.data = this.rosParamService
      .getParamNames()
      .pipe(
        concatMap<string[], string>((x) => x),
        concatMap((param) => {
          return this.rosParamService
            .getParam(param)
            .pipe(
              map((value) => {
                return { name: param, value };
              })
            );
        }),
        reduce<any, any[]>((array, value) => {
          array.push(value);
          return array;
        }, []),
        map((values) => {
          this.source.load(values);

          return this.source;
        })
      );

  }

  onRowClick(event: any) {
    console.log(event);
  }

  private handleAdded(element) {
    this.rosParamService.setParam(element.name, element.value)
      .subscribe(() => {
        this.toastService.success('', 'Parameter hinzugefügt!');
      }, (err) => {
        this.toastService.danger('Lade neu...', 'Fehler!');
        setTimeout(() => {
          this.refresh();
        }, 2500);
      });
  }

  private handleDelete(element) {
    this.rosParamService.deleteParam(element.name)
      .subscribe(() => {
        this.toastService.success('', 'Parameter gelöscht!');
      }, (err) => {
        this.toastService.danger('Lade neu...', 'Fehler!');
        setTimeout(() => {
          this.refresh();
        }, 2500);
      });

  }

  private handleUpdate(element) {
    let input: string = element.value.replace(/^"(.+(?="$))"$/, '$1');
    let number = convertStringToNumber(element.value);
    let paramValue;
    if (isNaN(number)) {
      paramValue = input;
    } else {
      paramValue = number;
    }

    this.rosParamService.setParam(element.name, paramValue)
      .subscribe(() => {
        this.toastService.success('', 'Parameter verändert!');
      }, (err) => {
        this.toastService.danger('Lade neu...', 'Fehler!');
        setTimeout(() => {
          this.refresh();
        }, 2500);
      });
  }

}
