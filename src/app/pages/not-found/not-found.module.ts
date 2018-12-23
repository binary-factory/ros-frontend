import { NgModule } from '@angular/core';
import { ThemeModule } from '../../theme/theme.module';
import { NotFoundComponent } from './not-found.component';

@NgModule({
  imports: [
    ThemeModule
  ],
  declarations: [
    NotFoundComponent
  ]
})
export class NotFoundModule {
}
