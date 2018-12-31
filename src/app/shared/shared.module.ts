import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxEchartsModule } from 'ngx-echarts';
import { ThemeModule } from '../theme/theme.module';

const sharedModules = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  ThemeModule,
  NgxEchartsModule
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
