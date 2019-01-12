import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { SettingsPageComponent } from './settings-page.component';

@NgModule({
  declarations: [SettingsPageComponent],
  imports: [
    SharedModule
  ]
})
export class SettingsPageModule { }
