import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppStoreModule} from '../../../store';
import {
  getCurrentIndex,
  getCurrentSong,
  getPlayList,
  getPlayMode,
  getSongList
} from '../../../store/selectors/player.selectors';
import {Song} from '../../../service/data-types/common.types';
import {PlayMode} from './player-types';
import {setCurrentIndex} from '../../../store/actions/player.actions';

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less']
})
export class WyPlayerComponent implements OnInit, AfterViewInit {

  percent = 0;
  bufferPercent = 0;

  songList: Song[];
  playList: Song[];
  currentIndex: number;
  playMode: PlayMode;
  currentSong: Song;
  duration = 0;
  currentTime = 0;
  playing = false;  // 是否正在播放
  songReady = false;  // 是否可以播放

  @ViewChild('audioEl', {static: true}) private audio: ElementRef;
  private audioEl: HTMLAudioElement;

  constructor(
    private store$: Store<{ player: AppStoreModule }>
  ) {
    const playerStore$ = this.store$.pipe(select('player'));
    // playerStore$.pipe(select(getSongList)).subscribe(list => {
    //   console.log(list);
    // });
    // playerStore$.pipe(select(getPlayList)).subscribe(list => {
    //   console.log(list);
    // });
    // playerStore$.pipe(select(getCurrentIndex)).subscribe(index => {
    //   console.log(index);
    // });

    const stateArr = [
      {type: getSongList, cb: (list) => this.watchList(list, 'songList')},
      {type: getPlayList, cb: (list) => this.watchList(list, 'playList')},
      {type: getCurrentIndex, cb: (index) => this.watchCurrentIndex(index)},
      {type: getPlayMode, cb: (mode) => this.watchPlayMode(mode)},
      {type: getCurrentSong, cb: (song) => this.watchCurrentSong(song)}
    ];

    stateArr.forEach(item => {
      // @ts-ignore
      playerStore$.pipe(select(item.type)).subscribe(item.cb);
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.audioEl = this.audio.nativeElement;
  }

  watchList(list, type): void {
    this[type] = list;
  }

  watchCurrentIndex(currentIndex): void {
    this.currentIndex = currentIndex;
  }

  watchPlayMode(mode: PlayMode): void {
    this.playMode = mode;
  }

  watchCurrentSong(song: Song): void {
    if (song) {
      this.currentSong = song;
      this.duration = song.dt / 1000;
    }
  }

  // 进度条拖动监听
  onPercentChange(per): void {
    this.audioEl.currentTime = this.duration * (per / 100);
  }

  onToggle(): void {
    if (!this.currentSong) {
      if (this.playList.length) {
        this.updateIndex(0);
      }
    } else {
      if (this.songReady) {
        this.playing = !this.playing;
        if (this.playing) {
          this.audioEl.play();
        } else {
          this.audioEl.pause();
        }
      }
    }
  }

  // 上一曲
  onPrev(index: number): void {
    if (!this.songReady) {
      return;
    }
    const newIndex = index <= 0 ? this.playList.length - 1 : index;
    this.updateIndex(newIndex);
  }

  // 下一曲
  onNext(index: number): void {
    if (!this.songReady) {
      return;
    }
    const newIndex = index >= this.playList.length - 1 ? 0 : index;
    this.updateIndex(newIndex);
  }

  // 单曲循环
  private loop(): void {
    this.audioEl.currentTime = 0;
    this.play();
  }

  private updateIndex(index: number): void {
    this.store$.dispatch(setCurrentIndex({currentIndex: index}));
    this.songReady = false;
  }

  // 监听播放器事件
  onCanPlay(): void {
    this.playing = true;
    this.play();
  }

  // 播放时事件更新
  onTimeupdate(e): void {
    this.currentTime = e.target.currentTime;
    this.percent = this.currentTime / this.duration * 100;
    const buffered = this.audioEl.buffered;
    if (buffered.length && this.bufferPercent < 100) {
      this.bufferPercent = buffered.end(0) / this.duration * 100;
    }
  }

  private play(): void {
    this.songReady = true;
    this.audioEl.play();
  }

  get picUrl(): string {
    return this.currentSong ?
      this.currentSong.al.picUrl :
      '//s4.music.126.net/style/web2/img/default/default_album.jpg';
  }

}
