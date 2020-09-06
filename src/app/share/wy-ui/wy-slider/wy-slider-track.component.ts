import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {WySliderStyle} from './wy-slider-types';

@Component({
  selector: 'app-wy-slider-track',
  template: `
    <div class="wy-slider-track" [ngStyle]="style" [class.buffer]="wyBuffer"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WySliderTrackComponent implements OnInit, OnChanges {
  @Input() wyVertical = false;
  @Input() wyLength: number;
  @Input() wyBuffer = false;
  public style: WySliderStyle = {};

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.wyLength) {
      // 是垂直的
      if (this.wyVertical) {
        this.style.height = this.wyLength + '%';
        this.style.left = null;
        this.style.width = null;
      } else {
        this.style.width = this.wyLength + '%';
        this.style.height = null;
        this.style.bottom = null;
      }
    }
  }

}
