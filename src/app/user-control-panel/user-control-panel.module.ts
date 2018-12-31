import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { OneColumnLayoutComponent } from './components/one-column-layout/one-column-layout';

import { UserControlPanelComponent } from './components/user-control-panel/user-control-panel.component';
import { DashboardPageModule } from './pages/dashboard-page/dashboard-page.module';
import { NotFoundPageModule } from './pages/not-found-page/not-found-page.module';
import { RosPagesModule } from './pages/ros-pages/ros-pages.module';
import { UserControlPanelRoutingModule } from './user-control-panel-routing.module';

const PAGES_COMPONENTS = [
  UserControlPanelComponent,
  FooterComponent,
  HeaderComponent,
  OneColumnLayoutComponent
];

@NgModule({
  imports: [
    SharedModule,
    DashboardPageModule,
    NotFoundPageModule,
    RosPagesModule,
    UserControlPanelRoutingModule
  ],
  declarations: [
    ...PAGES_COMPONENTS
  ]
})
export class UserControlPanelModule {
}
