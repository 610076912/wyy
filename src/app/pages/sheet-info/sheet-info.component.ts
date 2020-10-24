import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {map, takeUntil} from 'rxjs/operators';
import {Song, SongSheet} from '../../service/data-types/common.types';
import {Subject} from 'rxjs';
import {AppStoreModule} from '../../store';
import {select, Store} from '@ngrx/store';
import {getCurrentSong} from '../../store/selectors/player.selectors';
import {SongService} from '../../service/song.service';
import {BatchActionService} from '../../store/batch-action.service';
import {NzMessageService} from 'ng-zorro-antd';
import {findIndex} from '../../utils/array';

@Component({
  selector: 'app-sheet-info',
  templateUrl: './sheet-info.component.html',
  styleUrls: ['./sheet-info.component.less']
})
export class SheetInfoComponent implements OnInit, OnDestroy {
  sheetInfo: SongSheet;
  description = {
    short: '',
    long: ''
  };
  controlDesc = {
    isExpand: false,
    label: '展开',
    iconCls: 'down'
  };
  currentSong: Song;
  currentIndex = -1;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private store$: Store<{ player: AppStoreModule }>,
    private songServe: SongService,
    private batchActionServe: BatchActionService,
    private message: NzMessageService
  ) {
    this.route.data.pipe(map(res => res.sheetInfo)).subscribe(res => {
      this.sheetInfo = res;
      if (res.description) {
        this.changeDesc(res.description);
      }
      this.listenCurrent();
    });
  }

  ngOnInit(): void {
  }

  listenCurrent(): void {
    this.store$
      .pipe(select('player'), select(getCurrentSong), takeUntil(this.destroy$))
      .subscribe(song => {
        this.currentSong = song;
        if (this.currentSong) {
          this.currentIndex = findIndex(this.sheetInfo.tracks, song);
        } else {
          this.currentIndex = -1;
        }
      });
  }

  changeDesc(desc: string): void {
    if (desc.length < 99) {
      this.description.short = desc;
    } else {
      this.description = {
        short: desc.slice(0, 99) + '...',
        long: desc
      };
    }
  }

  toggleDesc(): void {
    this.controlDesc.isExpand = !this.controlDesc.isExpand;
    if (this.controlDesc.isExpand) {
      this.controlDesc.label = '收起';
      this.controlDesc.iconCls = 'up';
    } else {
      this.controlDesc.label = '展开';
      this.controlDesc.iconCls = 'down';
    }
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
