import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '../theme/theme.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { OneColumnLayoutComponent } from './components/one-column-layout/one-column-layout';

const sharedModules = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  ThemeModule,
  NgxEchartsModule
];

const sharedComponents = [
  FooterComponent,
  HeaderComponent,
  OneColumnLayoutComponent
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
