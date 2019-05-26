import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserControlPanelComponent } from './components/user-control-panel/user-control-panel.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';

const routes: Routes = [{
  path: '',
  component: UserControlPanelComponent,
  children: [
    {
      path: 'cockpit',
      component: DashboardPageComponent
    },
    {
      path: 'ros',
      loadChildren: './pages/ros-pages/ros-pages.module#RosPagesModule'
    },
    {
      path: '',
      redirectTo: 'cockpit',
      pathMatch: 'full'
    },
    {
      path: '**',
      component: NotFoundPageComponent
    }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserControlPanelRoutingModule {
}
