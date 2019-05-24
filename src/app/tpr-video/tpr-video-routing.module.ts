import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TprVideoPageComponent } from './tpr-video-page/tpr-video-page.component';

const routes: Routes = [
  {
    path: '**',
    component: TprVideoPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TprVideoRoutingModule { }
