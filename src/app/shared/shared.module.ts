import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '../theme/theme.module';
import { NgxEchartsModule } from 'ngx-echarts';

const sharedModules = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  ThemeModule,
  NgxEchartsModule
];

const sharedComponents = [

];

@NgModule({
  imports: [
    ...sharedModules,
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
