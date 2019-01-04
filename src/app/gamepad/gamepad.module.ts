import { ModuleWithProviders, NgModule } from '@angular/core';
import { GamepadService } from './gamepad.service';

@NgModule({
  declarations: [],
  imports: []
})
export class GamepadModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: GamepadModule,
      providers: [
        GamepadService
      ]
    };
  }
}
