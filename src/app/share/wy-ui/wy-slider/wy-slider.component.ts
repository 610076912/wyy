import {
  ChangeDetectionStrategy,
  Component,
  ElementRef, Inject,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { fromEvent, Observable, merge } from 'rxjs';
import { distinctUntilChanged, filter, map, pluck, takeUntil, tap } from 'rxjs/operators';
import { WySliderEventObservableConfig } from './wy-slider-types';
import { DOCUMENT } from '@angular/common';
import { inArray } from '../../../utils/array';

@Component({
  selector: 'app-wy-slider',
  templateUrl: './wy-slider.component.html',
  styleUrls: ['./wy-slider.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WySliderComponent implements OnInit {
  @Input() wyVertical = false;
  @Input() wyMin = 0;
  @Input() wyMax = 100;

  @ViewChild('wySlider', {static: true}) private wySlider: ElementRef;

  private sliderDom: HTMLDivElement;
  private dragStart$: Observable<number>;
  private dragMove$: Observable<number>;
  private dragEnd$: Observable<Event>;

  constructor(@Inject(DOCUMENT) private doc: Document) {
  }

  ngOnInit(): void {
    this.sliderDom = this.wySlider.nativeElement;
    this.createDraggingObservables();
  }

  private createDraggingObservables(): void {
    const orientField = this.wyVertical ? 'pageY' : 'pageX';
    const mouse: WySliderEventObservableConfig = {
      start: 'mousedown',
      move: 'mousemove',
      end: 'mouseup',
      filterFunc: e => e instanceof MouseEvent,
      pluckKey: [orientField]
    };

    const touch: WySliderEventObservableConfig = {
      start: 'touchstart',
      move: 'touchmove',
      end: 'touchend',
      filterFunc: e => e instanceof TouchEvent,
      pluckKey: ['touches', '0', orientField]
    };
    [mouse, touch].forEach(source => {
      const {start, move, end, filterFunc: filterFn, pluckKey} = source;
      source.startPlucked$ = fromEvent(this.sliderDom, start).pipe(
        filter(filterFn),
        tap((e: Event) => {
          e.stopPropagation();
          e.preventDefault();
        }),
        pluck(...pluckKey),
        map((position: number) => this.findClosestValue(position))
      );

      source.end$ = fromEvent(this.doc, end);

      source.moveResolved$ = fromEvent(this.doc, move).pipe(
        filter(filterFn),
        tap((e: Event) => {
          e.stopPropagation();
          e.preventDefault();
        }),
        pluck(...pluckKey),
        distinctUntilChanged(),
        map((position: number) => this.findClosestValue(position)),
        takeUntil(source.end$)
      );
    });

    this.dragStart$ = merge(mouse.startPlucked$, touch.startPlucked$);
    this.dragMove$ = merge(mouse.moveResolved$, touch.moveResolved$);
    this.dragEnd$ = merge(mouse.end$, touch.end$);
  }

  private subScribeDrag(events: string[] = ['start', 'move', 'end']): void {
    if (inArray(events, 'start') && this.dragStart$) {
      this.dragStart$.subscribe(this.onDragStart);
    }
    if (inArray(events, 'move') && this.dragMove$) {
      this.dragMove$.subscribe(this.onDragMove);
    }
    if (inArray(events, 'end') && this.dragEnd$) {
      this.dragEnd$.subscribe(this.onDragEnd);
    }
  }

  onDragStart(): void {
  }

  onDragMove(): void {
  }

  onDragEnd(): void {
  }

  findClosestValue(position: number): number {
    const sliderLength = this.getSliderLength();

    const sliderStart = this.getSliderStartPosition();
  }

  // 获取滑动组件长度
  getSliderLength(): number {
    return this.wyVertical ? this.sliderDom.clientHeight : this.sliderDom.clientWidth;
  }

  // 获取滑动组件端点位置
  getSliderStartPosition(): number {
    const sliderDomRect = this.sliderDom.getBoundingClientRect();
    const win = this.sliderDom.ownerDocument.defaultView;
    return this.wyVertical ? sliderDomRect.top + win.pageYOffset : sliderDomRect.left + win.pageXOffset;
  }
}
