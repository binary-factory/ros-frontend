import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { UserControlPanelComponent } from './components/user-control-panel/user-control-panel.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ROSParamsComponent } from './pages/ros/params/params.component';
import { ROSServicesComponent } from './pages/ros/services/services.component';
import { ROSTopicsComponent } from './pages/ros/topics/topics.component';
import { ROSNodesComponent } from './pages/ros/nodes/nodes.component';

const routes: Routes = [{
  path: '',
  component: UserControlPanelComponent,
  children: [
    {
      path: 'cockpit',
      component: DashboardComponent
    },
    {
      path: 'ros/nodes',
      component: ROSNodesComponent
    },
    {
      path: 'ros/params',
      component: ROSParamsComponent
    },
    {
      path: 'ros/services',
      component: ROSServicesComponent
    },
    {
      path: 'ros/topics',
      component: ROSTopicsComponent
    },
    {
      path: '',
      redirectTo: 'cockpit',
      pathMatch: 'full'
    },
    {
      path: '**',
      component: NotFoundComponent
    }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserControlPanelRoutingModule {
}
