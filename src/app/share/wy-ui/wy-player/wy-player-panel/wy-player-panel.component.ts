import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { Song } from '../../../../service/data-types/common.types';
import { WyScrollComponent } from '../wy-scroll/wy-scroll.component';
import { findIndex } from '../../../../utils/array';
import { timer } from 'rxjs';
import { WINDOW } from '../../../../service/service.module';
import { SongService } from '../../../../service/song.service';
import { BaseLyricLine, LyricLine, WyLyric } from './wy-lyric';

@Component({
  selector: 'app-wy-player-panel',
  templateUrl: './wy-player-panel.component.html',
  styleUrls: ['./wy-player-panel.component.less']
})
export class WyPlayerPanelComponent implements OnInit, OnChanges {

  public scrollY = 0;
  public currentIndex: number;
  public currentLyric: BaseLyricLine[];
  private lyric: WyLyric;
  private lyricRefs: NodeList;
  currentLineNum: number;
  @Input() playing: boolean;
  @Input() songList: Song[];
  @Input() currentSong: Song;
  @Input() show = true;

  @Output() closePanel = new EventEmitter<void>();
  @Output() changeSong = new EventEmitter<Song>();
  @Output() deleteSong = new EventEmitter<Song>();
  @Output() clearSong = new EventEmitter<void>();

  @ViewChildren(WyScrollComponent) readonly wyScroll: QueryList<WyScrollComponent>;

  constructor(
    @Inject(WINDOW) private win: Window,
    private songServe: SongService
  ) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['songList']) {
      this.currentIndex = findIndex(this.songList, this.currentSong);
    }
    if (changes['currentSong']) {
      if (this.currentSong) {
        this.currentIndex = findIndex(this.songList, this.currentSong);
        this.updateLyric();
        if (this.currentSong && this.show) {
          this.scrollToCurrent();
        }
      } else {
        this.resetLyric();
      }
    }
    if (changes['show']) {
      if (!changes['show'].firstChange && this.show) {
        // todo 刷新歌单列表和歌词面板
        this.wyScroll.first.refreshScroll();
        this.wyScroll.last.refreshScroll();
        timer(80).subscribe(() => {
          if (this.currentSong) {
            this.scrollToCurrent(0);
          }
        });
        // todo 用timer操作符代替全局变量下的setTimeout
        // this.win.setTimeout(() => {
        //   if (this.currentSong) {
        //     this.scrollToCurrent(0);
        //   }
        // }, 80);
      }
    }

    if (changes.playing) {
      if (!changes.playing.firstChange && this.lyric) {
        this.lyric.togglePlay(this.playing);
      }
    }
  }

  private updateLyric(): void {
    this.resetLyric();
    this.songServe.getLyric(this.currentSong.id).subscribe(res => {
      this.lyric = new WyLyric(res);
      this.currentLyric = this.lyric.lines;
      console.log('currentLyric', this.currentLyric);
      this.handlerLyric();
      this.wyScroll.last.scrollTo();
      if (this.playing) {
        this.lyric.play();
      }
    });
  }

  private handlerLyric(): void {
    this.lyric.handler.subscribe(({ lineNum }) => {
      if (!this.lyricRefs) {
        this.lyricRefs = this.wyScroll.last.el.nativeElement.querySelectorAll('ul li');
      }
      if (this.lyricRefs.length) {
        this.currentLineNum = lineNum;
        const targetLine = this.lyricRefs[lineNum];
        if (targetLine) {
          this.wyScroll.last.scrollToElement(targetLine, 300, false, false);
        }
      }
    });
  }

  resetLyric(): void {
    if (this.lyric) {
      this.lyric.stop();
      this.lyric = null;
      this.currentLineNum = 0;
      this.lyricRefs = null;
      this.currentLyric = [];
    }
  }

  seekLyric(time: number): void {
    if (this.lyric) {
      this.lyric.seek(time);
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
