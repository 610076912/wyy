import { NgModule } from '@angular/core';
import { WySliderComponent } from './wy-slider.component';
import {WySliderTrackComponent} from './wy-slider-track.component';
import {WySliderHandleComponent} from './wy-slider-handle.component';



@NgModule({
  declarations: [
    WySliderComponent,
    WySliderHandleComponent,
    WySliderTrackComponent
  ],
  imports: [
  ],
  exports: [WySliderComponent]
})
export class WySliderModule { }
