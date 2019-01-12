import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export interface CardHeaderButton {
  name: string;
  isActive: boolean;
  icon: string;
}

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
  refreshButton: boolean;

  @Input()
  headerButtons: Array<CardHeaderButton> = [];

  @Input()
  error: Error;

  @Input()
  size: string;

  @Output()
  refresh = new EventEmitter<void>();

  @Output()
  headerClick = new EventEmitter<CardHeaderButton>();

  constructor() {
  }

  ngOnInit() {
  }

  onRefresh() {
    this.refresh.emit();
  }

  onHeaderButtonClick(event: MouseEvent, sender: CardHeaderButton) {
    this.headerClick.emit(sender);
  }

}
