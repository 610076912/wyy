import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ZorroModule } from './zorro/zorro.module';
import { WyUiModule } from './wy-ui/wy-ui.module';
import { ClickoutsideDirective } from './directives/clickoutside.directive';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ZorroModule,
    WyUiModule
  ],
  exports: [
    FormsModule,
    ZorroModule,
    CommonModule,
    WyUiModule
  ]
})
export class ShareModule {
}
