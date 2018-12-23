import { NgModule } from '@angular/core';
import { ROSNodesComponent } from './nodes/nodes.component';
import { ROSTopicsComponent } from './topics/topics.component';
import { ROSServicesComponent } from './services/services.component';
import { ROSParamsComponent } from './params/params.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    ROSNodesComponent,
    ROSTopicsComponent,
    ROSServicesComponent,
    ROSParamsComponent
  ],
  imports: [
    SharedModule
  ]
})
export class ROSModule {
}
