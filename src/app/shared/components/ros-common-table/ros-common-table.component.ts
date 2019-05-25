import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Observable, Subscription, Subject } from 'rxjs';
import { debounceTime, buffer, map, filter } from 'rxjs/operators';

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

  click$ = new Subject();

  selected: any;

  doubleClick$ = this.click$.pipe(
    buffer(this.click$.pipe(
      debounceTime(250),
    )),
    map(list => {
      return list.length;
    }),
    filter(x => x === 2),
  )

  constructor() {
  }

  ngOnInit() {
    this.doubleClick$.subscribe(_ =>{
      this.rowClick.emit(this.selected);
    })
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
    this.selected = selected;
    this.click$.next();
  }
}
