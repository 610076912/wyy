import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren} from '@angular/core';
import {Song} from '../../../../service/data-types/common.types';
import {WyScrollComponent} from '../wy-scroll/wy-scroll.component';

@Component({
  selector: 'app-wy-player-panel',
  templateUrl: './wy-player-panel.component.html',
  styleUrls: ['./wy-player-panel.component.less']
})
export class WyPlayerPanelComponent implements OnInit, OnChanges {

  public scrollY = 0;
  @Input() songList: Song[];
  @Input() currentSong: Song;
  @Input() currentIndex: number;
  @Input() show = true;

  @Output() closePanel = new EventEmitter<void>();
  @Output() changeSong = new EventEmitter<Song>();

  @ViewChildren(WyScrollComponent) private wyScroll: QueryList<WyScrollComponent>;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['songList']) {
    }
    if (changes['currentSong']) {
      console.log(this.songList);
      if (this.currentSong && this.show) {
        this.scrollToCurrent();
      }
    }
    if (changes['show']) {
      if (!changes['show'].firstChange && this.show) {
        this.wyScroll.first.refreshScroll();
        setTimeout(() => {
          if (this.currentSong) {
            this.scrollToCurrent();
          }
        }, 80);
      }
    }
  }

  scrollToCurrent(): void {
    const songListRefs = this.wyScroll.first.el.nativeElement.querySelectorAll('ul li');
    if (songListRefs.length) {
      const currentLi = songListRefs[this.currentIndex || 0];
      const offsetTop = currentLi.offsetTop;
      if ((offsetTop - Math.abs(this.scrollY)) > 205 || (offsetTop - Math.abs(this.scrollY)) < 0) {
        this.wyScroll.first.scrollToElement(currentLi, 300, false, false);
      }
    }
  }
}
