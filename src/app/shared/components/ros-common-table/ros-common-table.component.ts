import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'ngx-ros-common-table',
  templateUrl: './ros-common-table.component.html',
  styleUrls: ['./ros-common-table.component.scss']
})
export class RosCommonTableComponent implements OnInit, OnDestroy {

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

  err: any;

  sub: Subscription;

  constructor() {
  }

  ngOnInit() {
    this.source.onAdded().subscribe(console.log)
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  @Input()
  set data(data: Observable<any>) {
    this.err = null;
    this.isLoading = true;

    this.sub = data.subscribe((resolved) => {
      if (resolved instanceof LocalDataSource) {
        this.source = resolved;
      } else {
        this.source.load(resolved);
      }
    }, (err) => {
      this.err = err;
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
