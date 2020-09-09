import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WyPlayerComponent } from './wy-player.component';
import { WySliderModule } from '../wy-slider/wy-slider.module';
import { FormsModule } from '@angular/forms';
import { FormatTimePipe } from '../../pips/format-time.pipe';
import {WyUiModule} from '../wy-ui.module';
import { WyPlayerPanelComponent } from './wy-player-panel/wy-player-panel.component';


@NgModule({
  declarations: [
    WyPlayerComponent,
    FormatTimePipe,
    WyPlayerPanelComponent
  ],
    imports: [
        CommonModule,
        WySliderModule,
        FormsModule,
    ],
  exports: [
    WyPlayerComponent
  ]
})
export class WyPlayerModule {
}
