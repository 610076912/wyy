import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WyPlayerComponent } from './wy-player.component';
import { WySliderModule } from '../wy-slider/wy-slider.module';
import { FormsModule } from '@angular/forms';
import { FormatTimePipe } from '../../pips/format-time.pipe';
import { WyPlayerPanelComponent } from './wy-player-panel/wy-player-panel.component';
import { WyScrollComponent } from './wy-scroll/wy-scroll.component';
import { ClickoutsideDirective } from '../../directives/clickoutside.directive';




@NgModule({
  declarations: [
    WyPlayerComponent,
    FormatTimePipe,
    WyPlayerPanelComponent,
    WyScrollComponent,
    ClickoutsideDirective
  ],
  imports: [
    CommonModule,
    WySliderModule,
    FormsModule
  ],
  exports: [
    WyPlayerComponent,
    ClickoutsideDirective,
    FormatTimePipe
  ],

})
export class WyPlayerModule {
}
