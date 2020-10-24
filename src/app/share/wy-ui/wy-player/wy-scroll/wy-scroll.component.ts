import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  EventEmitter,
  Output, OnChanges, SimpleChanges, Input
} from '@angular/core';
import BScroll from '@better-scroll/core';
import ScrollBar from '@better-scroll/scroll-bar';
import MouseWheel from '@better-scroll/mouse-wheel';
import { timer } from 'rxjs';

BScroll.use(ScrollBar);
BScroll.use(MouseWheel);

@Component({
  selector: 'app-wy-scroll',
  template: `
    <div class="wy-scroll" #wrap>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .wy-scroll {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  `],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyScrollComponent implements OnInit, AfterViewInit, OnChanges {

  private bs: BScroll;
  @ViewChild('wrap', { static: true }) private wrapRef: ElementRef;
  @Input() data: any[];
  @Output() private ScrollEnd = new EventEmitter<number>();

  constructor(readonly el: ElementRef) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
      this.refreshScroll();
    }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.bs = new BScroll(this.wrapRef.nativeElement, {
      scrollbar: {
        interactive: true
      },
      mouseWheel: {}
    });
    this.bs.on('scrollEnd', ({ y }) => this.ScrollEnd.emit(y));
  }

  scrollToElement(...args): void {
    this.bs.scrollToElement.apply(this.bs, args);
  }

  scrollTo(...args): void {
    this.bs.scrollTo.apply(this.bs, args);
  }

  private refresh(): void {
    this.bs.refresh();
  }

  refreshScroll(): void {
    timer(50).subscribe(() => {
      this.refresh();
    });
    // todo 用timer操作符代替全局变量下的setTimeout
    // setTimeout(() => {
    //   this.refresh();
    // }, 50);
  }

}
