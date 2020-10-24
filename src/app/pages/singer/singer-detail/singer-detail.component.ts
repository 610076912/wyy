import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {map, takeUntil} from 'rxjs/operators';
import {SingerDetail, Song} from '../../../service/data-types/common.types';
import {SongService} from '../../../service/song.service';
import {BatchActionService} from '../../../store/batch-action.service';
import {NzMessageService} from 'ng-zorro-antd';
import {select, Store} from '@ngrx/store';
import {AppStoreModule} from '../../../store';
import {getCurrentSong} from '../../../store/selectors/player.selectors';
import {Subject} from 'rxjs';
import {findIndex} from '../../../utils/array';

@Component({
  selector: 'app-singer-detail',
  templateUrl: './singer-detail.component.html',
  styleUrls: ['./singer-detail.component.less']
})
export class SingerDetailComponent implements OnInit, OnDestroy {
  singerDetail: SingerDetail;
  currentIndex = -1;
  currentSong: Song;
  destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private store$: Store<{ player: AppStoreModule }>,
    private songServe: SongService,
    private batchActionServe: BatchActionService,
    private message: NzMessageService
  ) {
    this.route.data.pipe(map(res => res.singerDetail)).subscribe(res => {
      this.singerDetail = res;
    });
    this.listenCurrent();
  }

  ngOnInit(): void {
  }

  // 监听当前歌曲
  listenCurrent(): void {
    this.store$.pipe(select('player'), select(getCurrentSong), takeUntil(this.destroy$))
      .subscribe(song => {
        this.currentSong = song;
        if (this.currentSong) {
          this.currentIndex = findIndex(this.singerDetail.hotSongs, song);
        } else {
          this.currentIndex = -1;
        }
      });
  }

  // 添加一首歌曲
  onAddSong(song, isPlay = false): void {
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

  // 添加歌单
  onAddSongs(songs: Song[], isPlay = false): void {
    this.songServe.getSongList(songs).subscribe(list => {
      if (list.length) {
        if (isPlay) {
          this.batchActionServe.selectPlayList({list, index: 0});
        } else {
          this.batchActionServe.insertSongs(list);
        }
      } else {
        this.message.warning('当前歌曲无URL');
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
