import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef, forwardRef, Inject,
  Input, OnDestroy,
  OnInit, Output,
  ViewChild,
  ViewEncapsulation,
  EventEmitter
} from '@angular/core';
import {fromEvent, Observable, merge, Subscription} from 'rxjs';
import {distinctUntilChanged, filter, map, pluck, takeUntil, tap} from 'rxjs/operators';
import {SliderValue, WySliderEventObservableConfig} from './wy-slider-types';
import {DOCUMENT} from '@angular/common';
import {inArray} from '../../../utils/array';
import {getPercent, limitNumberInRange} from '../../../utils/number';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-wy-slider',
  templateUrl: './wy-slider.component.html',
  styleUrls: ['./wy-slider.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => WySliderComponent),
    multi: true
  }]
})
export class WySliderComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() wyVertical = false;
  @Input() wyMin = 0;
  @Input() wyMax = 100;
  @Input() bufferOffset: SliderValue = 0;

  @Output() wyOnAfterChange = new EventEmitter<SliderValue>();

  @ViewChild('wySlider', {static: true}) private wySlider: ElementRef;

  private sliderDom: HTMLDivElement;
  private dragStart$: Observable<number>;
  private dragMove$: Observable<number>;
  private dragEnd$: Observable<Event>;
  private dragStartR: Subscription | null;
  private dragMoveR: Subscription | null;
  private dragEndR: Subscription | null;

  private isDragging = false;  // 是否正在移动
  public value: SliderValue;
  public offset: SliderValue = null;

  // ngModel 需要的事件
  // private onValueChange: (value: SliderValue) => void;
  // private onTouched: () => void;

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.sliderDom = this.wySlider.nativeElement;
    this.createDraggingObservables();
    this.subscribeDrag(['start']);
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

  private subscribeDrag(events: string[] = ['start', 'move', 'end']): void {
    if (inArray(events, 'start') && this.dragStart$ && !this.dragStartR) {
      this.dragStartR = this.dragStart$.subscribe(this.onDragStart.bind(this));
    }
    if (inArray(events, 'move') && this.dragMove$ && !this.dragMoveR) {
      this.dragMoveR = this.dragMove$.subscribe(this.onDragMove.bind(this));
    }
    if (inArray(events, 'end') && this.dragEnd$ && !this.dragEndR) {
      this.dragEndR = this.dragEnd$.subscribe(this.onDragEnd.bind(this));
    }
  }

  private unSubscribeDrag(events: string[] = ['start', 'move', 'end']): void {
    if (inArray(events, 'start') && this.dragStartR) {
      this.dragStartR.unsubscribe();
      this.dragStartR = null;
    }
    if (inArray(events, 'move') && this.dragMoveR) {
      this.dragMoveR.unsubscribe();
      this.dragMoveR = null;
    }
    if (inArray(events, 'end') && this.dragEndR) {
      this.dragEndR.unsubscribe();
      this.dragEndR = null;
    }
  }

  private onDragStart(value: number): void {
    this.setValue(value);
    this.toggleDragMoving(true);
  }

  private onDragMove(value: number): void {
    if (this.isDragging) {
      this.setValue(value);
      this.cdr.markForCheck();
    }
  }

  private onDragEnd(): void {
    this.wyOnAfterChange.emit(this.value);
    this.toggleDragMoving(false);
    this.cdr.markForCheck();
  }

  private setValue(value: SliderValue, needCheck = false): void {
    if (needCheck) {
      if (this.isDragging) {
        return;
      }
      this.value = this.formatValue(value);
      this.updateTrackAndHandles();
    } else if (value !== this.value) {
      this.value = value;
      this.updateTrackAndHandles();
      this.onValueChange(this.value);
    }
  }

  private formatValue(value: SliderValue): SliderValue {
    if (this.assertValueValid(value)) {
      value = this.wyMin;
    } else {
      value = limitNumberInRange(value, this.wyMin, this.wyMax);
    }
    return value;
  }

  public assertValueValid(value: SliderValue): boolean {
    return isNaN(typeof value !== 'number' ? parseFloat(value) : value);
  }

  // 更新子组件（进度条和滑块）的值
  private updateTrackAndHandles(): void {
    this.offset = this.getValueToOffset(this.value);
    this.cdr.markForCheck();
  }

  // 获取百分比
  private getValueToOffset(value: SliderValue): SliderValue {
    return getPercent(value, this.wyMin, this.wyMax);
  }

  // 绑定/解绑  move事件
  private toggleDragMoving(movable: boolean): void {
    this.isDragging = movable;
    if (movable) {
      this.subscribeDrag(['move', 'end']);
    } else {
      this.unSubscribeDrag(['move', 'end']);
    }
  }

  private findClosestValue(position: number): number {
    const sliderLength = this.getSliderLength();
    const sliderStart = this.getSliderStartPosition();
    const ratio = limitNumberInRange((position - sliderStart) / sliderLength, 0, 1);
    const ratioTure = this.wyVertical ? 1 - ratio : ratio;
    return ratioTure * (this.wyMax - this.wyMin) + this.wyMin;
  }

  // 获取滑动组件长度
  private getSliderLength(): number {
    return this.wyVertical ? this.sliderDom.clientHeight : this.sliderDom.clientWidth;
  }

  // 获取滑动组件端点位置
  private getSliderStartPosition(): number {
    const sliderDomRect = this.sliderDom.getBoundingClientRect();
    // window
    const win = this.sliderDom.ownerDocument.defaultView;
    return this.wyVertical ? sliderDomRect.top + win.pageYOffset : sliderDomRect.left + win.pageXOffset;
  }

  // 定义在开头
  private onValueChange(value: SliderValue): void {
  }

  private onTouched(): void {
  }

  writeValue(value: SliderValue): void {
    this.setValue(value);
  }

  registerOnChange(fn: (value: SliderValue) => void): void {
    this.onValueChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }

  ngOnDestroy(): void {
    this.unSubscribeDrag();
  }
}
