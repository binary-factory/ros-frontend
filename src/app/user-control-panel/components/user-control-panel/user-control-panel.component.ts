import { Component } from '@angular/core';

import { MENU_ITEMS } from '../../user-control-panel-menu';

@Component({
  selector: 'ngx-pages',
  templateUrl: './user-control-panel.component.html'
})
export class UserControlPanelComponent {

  menu = MENU_ITEMS;
}
