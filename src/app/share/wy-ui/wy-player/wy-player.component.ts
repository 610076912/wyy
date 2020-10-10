import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppStoreModule } from '../../../store';
import {
  getCurrentIndex,
  getCurrentSong,
  getPlayList,
  getPlayMode,
  getSongList
} from '../../../store/selectors/player.selectors';
import { Song } from '../../../service/data-types/common.types';
import { PlayMode } from './player-types';
import { setCurrentIndex, setPlayList, setPlayMode, setSongList } from '../../../store/actions/player.actions';
import { fromEvent, Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { findIndex, shuffle } from '../../../utils/array';
import { WyPlayerPanelComponent } from './wy-player-panel/wy-player-panel.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BatchActionService } from '../../../store/batch-action.service';

const modeTypes: PlayMode[] = [{
  type: 'loop',
  label: '循环'
}, {
  type: 'random',
  label: '随机'
}, {
  type: 'singleLoop',
  label: '单曲循环'
}];

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
  currentSong: Song;
  duration = 0;
  currentTime = 0;
  playing = false;  // 是否正在播放
  songReady = false;  // 是否可以播放
  volume = 40;   // 音量
  showVolumePanel = false; // 是否显示音量面板
  showPanel = false;    // 是否显示播放列表面板
  currentMode: PlayMode; // 当前的播放模式
  modeCount = 0; // 点击切换播放模式按钮次数

  bindFlag = false; // 是否给document绑定点击事件
  private winClick: Subscription;

  @ViewChild('audioEl', {static: true}) private audio: ElementRef;
  @ViewChild(WyPlayerPanelComponent) private playerPanel: WyPlayerPanelComponent;
  private audioEl: HTMLAudioElement;

  constructor(
    private store$: Store<{ player: AppStoreModule }>,
    @Inject(DOCUMENT) private doc: Document,
    private nzModalServe: NzModalService,
    private batchActionServe: BatchActionService
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
    this.currentMode = mode;
    if (this.songList) {
      let list = this.songList.slice(); // 脱离引用关系
      if (mode.type === 'random') {
        // 将数组的顺序打乱
        list = shuffle(this.songList);
        this.updateCurrentIndex(list, this.currentSong);
        this.store$.dispatch(setPlayList({playList: list}));
      }
    }
  }

  watchCurrentSong(song: Song): void {
    if (song) {
      this.currentSong = song;
      this.duration = song.dt / 1000;
    }
  }

  // 更新当前歌单index；
  private updateCurrentIndex(list: Song[], song: Song): void {
    const newIndex = list.findIndex(item => item.id === song.id);
    this.store$.dispatch(setCurrentIndex({currentIndex: newIndex}));
  }

  // 点击切换播放模式
  onChangeMode(): void {
    const temp = modeTypes[++this.modeCount % 3];
    this.store$.dispatch(setPlayMode({playMode: temp}));
  }

  // 进度条拖动监听
  onPercentChange(per: number): void {
    if (this.currentSong) {
      const currentTime = this.duration * (per / 100);
      this.audioEl.currentTime = currentTime;
      if (this.playerPanel) {
        this.playerPanel.seekLyric(currentTime * 1000);
      }
    }
  }

  // 音量
  onVolumeChange(per: number): void {
    this.audioEl.volume = per / 100;
  }

  // 是否展示音量控制面板
  toggleVolPanel(e: MouseEvent): void {
    e.stopPropagation();
    this.togglePanel('showVolumePanel');
  }

  // 是否展示播放列表面板
  togglePlayListPanel(e: MouseEvent): void {
    e.stopPropagation();
    if (this.songList.length > 0) {
      this.togglePanel('showPanel');
    }
  }

  // 播放列表切换歌曲
  onChangeSong(song: Song): void {
    this.updateCurrentIndex(this.playList, song);
  }

  onClickOutSide(): void {
    this.showVolumePanel = false;
    this.showPanel = false;
    this.bindFlag = false;
  }

  // 是否展示面板
  private togglePanel(type: string): void {
    this[type] = !this[type];
    this.bindFlag = this.showVolumePanel || this.showPanel;
  }

  // private bindDocumentClickListener(): void {
  //   if (!this.winClick) {
  //     this.winClick = fromEvent(this.doc, 'click').subscribe(() => {
  //       if (!this.clickSelf) {
  //         this.showVolumePanel = false;
  //         this.showPanel = false;
  //         this.unbindDocumentClickListener();
  //       }
  //       this.clickSelf = false;
  //     });
  //   }
  // }
  //
  // private unbindDocumentClickListener(): void {
  //   if (this.winClick) {
  //     this.winClick.unsubscribe();
  //     this.winClick = null;
  //   }
  // }

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
    const newIndex = index < 0 ? this.playList.length - 1 : index;
    this.updateIndex(newIndex);
  }

  // 下一曲
  onNext(index: number): void {
    if (!this.songReady) {
      return;
    }
    const newIndex = index > this.playList.length - 1 ? 0 : index;
    this.updateIndex(newIndex);
  }

  // 单曲循环
  private loop(): void {
    this.audioEl.currentTime = 0;
    this.play();
    if (this.playerPanel) {
      this.playerPanel.seekLyric(0);
    }
  }

  private updateIndex(index: number): void {
    this.store$.dispatch(setCurrentIndex({currentIndex: index}));
    // this.songReady = false;
  }

  // 监听播放器事件
  onCanPlay(): void {
    this.playing = true;
    this.play();
  }

  // 当前歌曲播放结束
  onPlayEnd(): void {
    this.playing = false;
    if (this.currentMode.type === 'singleLoop') {
      this.loop();
    } else {
      this.onNext(this.currentIndex + 1);
    }
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

  // 删除歌单中的歌曲
  onDeleteSong(song: Song): void {
    this.batchActionServe.deleteSong(song);
  }

  // 清空歌曲
  onClearSong(): void {
    this.nzModalServe.confirm({
      nzTitle: '确认清空列表？',
      nzOnOk: () => {
        this.batchActionServe.clearSong();
      }
    });
  }

}
