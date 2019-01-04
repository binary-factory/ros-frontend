import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxLoadingModule } from 'ngx-loading';
import { ThemeModule } from '../theme/theme.module';
import { RosNodesTableComponent } from './components/ros-nodes-table/ros-nodes-table.component';
import { RosParamsTableComponent } from './components/ros-params-table/ros-params-table.component';
import { RosServicesTableComponent } from './components/ros-services-table/ros-services-table.component';
import { RosTopicsTableComponent } from './components/ros-topics-table/ros-topics-table.component';
import { RosCommonTableComponent } from './components/ros-common-table/ros-common-table.component';

const sharedModules = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  ThemeModule,
  NgxEchartsModule,
  Ng2SmartTableModule,
  NgxLoadingModule
];

const sharedComponents = [
  RosNodesTableComponent,
  RosParamsTableComponent,
  RosServicesTableComponent,
  RosTopicsTableComponent
];

@NgModule({
  imports: [
    ...sharedModules
  ],
  exports: [
    ...sharedModules,
    ...sharedComponents
  ],
  declarations: [
    ...sharedComponents,
    RosCommonTableComponent
  ]
})
export class SharedModule {
}
