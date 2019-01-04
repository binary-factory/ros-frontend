import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Observable } from 'rxjs';

@Component({
  selector: 'ngx-ros-common-table',
  templateUrl: './ros-common-table.component.html',
  styleUrls: ['./ros-common-table.component.scss']
})
export class RosCommonTableComponent implements OnInit {

  @Input()
  settings: any;

  @Input()
  title = '';

  @Output()
  refresh = new EventEmitter<void>();

  @Output()
  rowClick = new EventEmitter<any>();

  source: LocalDataSource = new LocalDataSource();

  isLoading = false;

  constructor() {
  }

  ngOnInit() {
  }

  @Input()
  set data(data: Observable<Array<any>>) {
    this.isLoading = true;

    data.subscribe((resolved) => {
      this.source.load(resolved);
    }).add(() => {
      this.isLoading = false;
    });
  }

  onRefresh() {
    this.refresh.emit();
  }

  onUserRowSelect(selected: any) {
    this.rowClick.emit(selected);
  }
}
