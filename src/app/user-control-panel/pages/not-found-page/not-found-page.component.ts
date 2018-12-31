import { Component } from '@angular/core';
import { NbMenuService } from '@nebular/theme';

@Component({
  selector: 'ngx-not-found',
  styleUrls: ['./not-found-page.component.scss'],
  templateUrl: './not-found-page.component.html'
})
export class NotFoundPageComponent {

  constructor(private menuService: NbMenuService) {
  }

  goToHome() {
    // TODO: Replace with Navigator!
    this.menuService.navigateHome();
  }
}
