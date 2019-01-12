import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

interface HeaderButton {
  name: string;
  isActive: boolean;
  icon: string;
}

@Component({
  selector: 'ngx-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input()
  title: string;

  @Input()
  isLoading: boolean;

  @Input()
  refreshButton: boolean;

  @Input()
  headerButtons: Array<HeaderButton> = [];

  @Input()
  error: Error;

  @Output()
  refresh = new EventEmitter<void>();

  @Output()
  headerClick = new EventEmitter<{ event: MouseEvent, sender: HeaderButton }>();

  constructor() {
  }

  ngOnInit() {
  }

  onRefresh() {
    this.refresh.emit();
  }

  onHeaderButtonClick(event: MouseEvent, sender: HeaderButton) {
    this.headerClick.emit({ event, sender });
  }

}
