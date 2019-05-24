import { NgModule } from '@angular/core';

import { TprVideoRoutingModule } from './tpr-video-routing.module';
import { TprVideoPageComponent } from './tpr-video-page/tpr-video-page.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [TprVideoPageComponent],
  imports: [
    SharedModule,
    TprVideoRoutingModule
  ]
})
export class TprVideoModule { }
