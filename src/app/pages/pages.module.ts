import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../theme/theme.module';
import { NotFoundModule } from './not-found/not-found.module';
import { SharedModule } from '../shared/shared.module';

const PAGES_COMPONENTS = [
  PagesComponent
];

@NgModule({
  imports: [
    SharedModule,
    DashboardModule,
    NotFoundModule,
    PagesRoutingModule,
    ThemeModule
  ],
  declarations: [
    ...PAGES_COMPONENTS
  ]
})
export class PagesModule {
}
