import { Component, Input, OnInit } from '@angular/core';

import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { ROSClientService } from '../../../ros/shared/services/ros-client.service';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  @Input() position = 'normal';

  isConnected = false;

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private _rosClientService: ROSClientService) {
  }

  ngOnInit() {
    this._rosClientService.connected$.subscribe((connected) => {
      this.isConnected = connected;
    });
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    //this.layoutService.changeLayoutSize();

    return false;
  }

  goToHome() {
    this.menuService.navigateHome();
  }

}
