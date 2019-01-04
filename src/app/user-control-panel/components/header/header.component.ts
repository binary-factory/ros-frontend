import { Component, Input, OnInit } from '@angular/core';

import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { GamepadService } from '../../../gamepad/gamepad.service';
import { ROSClientService } from '../../../ros/shared/services/ros-client.service';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  @Input() position = 'normal';

  isConnected = false;

  isGamepadConnected = false;

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private rosClientService: ROSClientService,
              private gamepadService: GamepadService) {
  }

  ngOnInit() {
    this.rosClientService.connected$.subscribe((connected) => {
      this.isConnected = connected;
    });

    this.gamepadService.gamepads$.subscribe((gamepads) => {
      this.isGamepadConnected = gamepads.some((gamepad) => gamepad != null);
    });
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    // this.layoutService.changeLayoutSize();

    return false;
  }

  goToHome() {
    this.menuService.navigateHome();
  }

}
