import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-card-header-button',
  templateUrl: './card-header-button.component.html',
  styleUrls: ['./card-header-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardHeaderButtonComponent implements OnInit {

  @Input()
  isActive = false;

  @Input()
  icon = 'nb-gear';

  constructor() { }

  ngOnInit() {
  }

}
