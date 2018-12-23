import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [{
    path: 'iot-dashboard',
    component: DashboardComponent
  },
    {
      path: 'modal-overlays',
      loadChildren: './modal-overlays/modal-overlays.module#ModalOverlaysModule'
    },
    {
      path: 'extra-components',
      loadChildren: './extra-components/extra-components.module#ExtraComponentsModule'
    },
    {
      path: 'bootstrap',
      loadChildren: './bootstrap/bootstrap.module#BootstrapModule'
    },
    {
      path: 'charts',
      loadChildren: './charts/charts.module#ChartsModule'
    },
    {
      path: 'forms',
      loadChildren: './forms/forms.module#FormsModule'
    },
    {
      path: 'miscellaneous',
      loadChildren: './miscellaneous/miscellaneous.module#MiscellaneousModule'
    },
    {
      path: '',
      redirectTo: 'dashboard',
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
export class PagesRoutingModule {
}
