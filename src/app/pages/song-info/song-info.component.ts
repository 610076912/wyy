import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {map, takeUntil} from 'rxjs/operators';
import {Song} from '../../service/data-types/common.types';
import {BaseLyricLine, WyLyric} from '../../share/wy-ui/wy-player/wy-player-panel/wy-lyric';
import {select, Store} from '@ngrx/store';
import {getCurrentSong} from '../../store/selectors/player.selectors';
import {AppStoreModule} from '../../store';
import {SongService} from '../../service/song.service';
import {BatchActionService} from '../../store/batch-action.service';
import {NzMessageService} from 'ng-zorro-antd';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-song-info',
  templateUrl: './song-info.component.html',
  styleUrls: ['./song-info.component.less']
})
export class SongInfoComponent implements OnInit, OnDestroy {
  song: Song;
  lyric: BaseLyricLine[];
  controlLyric = {
    isExpand: false,
    label: '展开',
    iconCls: 'down'
  };
  currentSong: Song;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private store$: Store<{ player: AppStoreModule }>,
    private songServe: SongService,
    private batchActionServe: BatchActionService,
    private message: NzMessageService
  ) {
    this.route.data.pipe(map(res => res.songInfo)).subscribe(([song, lyric]) => {
      this.song = song;
      this.lyric = new WyLyric(lyric).lines;
    });
    this.listenCurrent();
  }

  ngOnInit(): void {
  }

  listenCurrent(): void {
    this.store$
      .pipe(select('player'), select(getCurrentSong), takeUntil(this.destroy$))
      .subscribe(song => this.currentSong = song);
  }

  toggleLyric(): void {
    this.controlLyric.isExpand = !this.controlLyric.isExpand;
    if (this.controlLyric.isExpand) {
      this.controlLyric.label = '收起';
      this.controlLyric.iconCls = 'up';
    } else {
      this.controlLyric.label = '展开';
      this.controlLyric.iconCls = 'down';
    }
  }

  onAddSong(song: Song, isPlay = false): void {
    if (!this.currentSong || this.currentSong.id !== song.id) {
      this.songServe.getSongList(song)
        .subscribe(list => {
          if (list.length) {
            this.batchActionServe.insertSong(list[0], isPlay);
          } else {
            this.message.warning('当前歌曲无URL');
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
