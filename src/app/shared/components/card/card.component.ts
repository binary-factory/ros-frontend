import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ngx-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent implements OnInit {

  @Input()
  title: string;

  @Input()
  isLoading: boolean;

  @Input()
  error: Error;

  @Input()
  size: string;

  constructor() {
  }

  ngOnInit() {
  }

}
