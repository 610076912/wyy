import {Component, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren} from '@angular/core';
import {Song} from '../../../../service/data-types/common.types';
import {WyScrollComponent} from '../wy-scroll/wy-scroll.component';
import {findIndex} from '../../../../utils/array';
import {timer} from 'rxjs';

@Component({
  selector: 'app-wy-player-panel',
  templateUrl: './wy-player-panel.component.html',
  styleUrls: ['./wy-player-panel.component.less']
})
export class WyPlayerPanelComponent implements OnInit, OnChanges {

  public scrollY = 0;
  public currentIndex: number;
  @Input() songList: Song[];
  @Input() currentSong: Song;
  @Input() show = true;

  @Output() closePanel = new EventEmitter<void>();
  @Output() changeSong = new EventEmitter<Song>();

  @ViewChildren(WyScrollComponent) readonly wyScroll: QueryList<WyScrollComponent>;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['songList']) {
    }
    if (changes['currentSong']) {
      this.currentIndex = findIndex(this.songList, this.currentSong);
      if (this.currentSong && this.show) {
        this.scrollToCurrent();
      }
    }
    if (changes['show']) {
      if (!changes['show'].firstChange && this.show) {
        this.wyScroll.first.refreshScroll();
        timer(80).subscribe(() => {
          if (this.currentSong) {
            this.scrollToCurrent(0);
          }
        });
        // todo 用timer操作符代替全局变量下的setTimeout
        // setTimeout(() => {
        //   if (this.currentSong) {
        //     this.scrollToCurrent(0);
        //   }
        // }, 80);
      }
    }
  }

  scrollToCurrent(speed = 300): void {
    const songListRefs = this.wyScroll.first.el.nativeElement.querySelectorAll('ul li');
    if (songListRefs.length) {
      const currentLi = songListRefs[this.currentIndex || 0];
      const offsetTop = currentLi.offsetTop;
      if ((offsetTop - Math.abs(this.scrollY)) > 205 || (offsetTop - Math.abs(this.scrollY)) < 0) {
        this.wyScroll.first.scrollToElement(currentLi, speed, false, false);
      }
    }
  }
}
