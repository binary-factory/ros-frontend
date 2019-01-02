import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxEchartsModule } from 'ngx-echarts';
import { ThemeModule } from '../theme/theme.module';

const sharedModules = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  ThemeModule,
  NgxEchartsModule,
  Ng2SmartTableModule
];

const sharedComponents = [];

@NgModule({
  imports: [
    ...sharedModules
  ],
  exports: [
    ...sharedModules,
    ...sharedComponents
  ],
  declarations: [
    ...sharedComponents
  ]
})
export class SharedModule {
}
