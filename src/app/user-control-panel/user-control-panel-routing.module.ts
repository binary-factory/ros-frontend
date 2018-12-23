import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { UserControlPanelComponent } from './components/user-control-panel/user-control-panel.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [{
  path: '',
  component: UserControlPanelComponent,
  children: [
    {
      path: 'cockpit',
      component: DashboardComponent
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
