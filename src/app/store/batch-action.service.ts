import { Injectable } from '@angular/core';
import { AppStoreModule } from './index';
import { Song } from '../service/data-types/common.types';
import { setCurrentIndex, setPlayList, setSongList } from './actions/player.actions';
import { findIndex, shuffle } from '../utils/array';
import { select, Store } from '@ngrx/store';
import { PlayState } from './reducers/player.reducer';

@Injectable({
  providedIn: AppStoreModule
})
export class BatchActionService {
  private playerState: PlayState;

  constructor(private store$: Store<{ player: AppStoreModule }>) {
    this.store$.pipe(select('player')).subscribe((res: PlayState) => {
      console.log('playerState:', res);
      this.playerState = res;
    });
  }

  // 播放列表
  selectPlayList({list, index}: { list: Song[], index: number }): void {
    console.log('播放列表:', list);
    const resList = list.filter(item => item.url != null); // 把没有url的歌曲过滤掉
    this.store$.dispatch(setSongList({songList: resList}));
    let trueIndex = index;
    let trueList = resList.slice();
    if (this.playerState.playMode.type === 'random') {
      trueList = shuffle(resList || []);
      trueIndex = findIndex(trueList, resList[trueIndex]);
    }
    this.store$.dispatch(setPlayList({playList: trueList}));
    this.store$.dispatch(setCurrentIndex({currentIndex: trueIndex}));
  }

  // 删除歌单中的歌曲
  deleteSong(song: Song): void {
    const songList = this.playerState.songList.slice();
    const playList = this.playerState.playList.slice();
    let currentIndex = this.playerState.currentIndex;
    const songIndex = findIndex(songList, song);
    songList.splice(songIndex, 1);
    const pIndex = findIndex(playList, song);
    playList.splice(pIndex, 1);
    if (currentIndex > pIndex || currentIndex === playList.length) {
      currentIndex--;
    }

    this.store$.dispatch(setSongList({ songList }));
    this.store$.dispatch(setPlayList({ playList }));
    this.store$.dispatch(setCurrentIndex({ currentIndex }));
  }

  // 清空歌曲
  clearSong(): void {
    this.store$.dispatch(setSongList({ songList: [] }));
    this.store$.dispatch(setPlayList({ playList: [] }));
    this.store$.dispatch(setCurrentIndex({ currentIndex: -1 }));
  }
}
