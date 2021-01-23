import {Injectable} from '@angular/core';
import {AppStoreModule} from './index';
import {Song} from '../service/data-types/common.types';
import {setCurrentIndex, setPlayList, setSongList} from './actions/player.actions';
import {setModalType, setModalVisible} from './actions/member.actions';
import {findIndex, shuffle} from '../utils/array';
import {select, Store} from '@ngrx/store';
import {PlayState} from './reducers/player.reducer';
import {MemberState, ModalTypes} from './reducers/member.reducer';

@Injectable({
  providedIn: AppStoreModule
})
export class BatchActionService {
  private playerState: PlayState;
  private memberState: MemberState;

  constructor(private store$: Store<{ player: AppStoreModule, member: AppStoreModule }>) {
    this.store$.pipe(select('player')).subscribe((res: PlayState) => {
      this.playerState = res;
    });
    this.store$.pipe(select('member')).subscribe((res: MemberState) => {
      this.memberState = res;
    });
  }

  // 添加歌曲
  insertSong(song: Song, isPlay: boolean): void {
    const songList = this.playerState.songList.slice();
    const playList = this.playerState.playList.slice();
    let insertIndex = this.playerState.currentIndex;
    const pIndex = findIndex(playList, song);
    // 歌曲已经存在当前歌单中
    if (pIndex > -1) {
      if (isPlay) {
        insertIndex = pIndex;
      }
    } else {
      songList.push(song);
      playList.push(song);
      if (isPlay) {
        insertIndex = songList.length - 1;
      }
      this.store$.dispatch(setSongList({songList}));
      this.store$.dispatch(setPlayList({playList}));
    }
    if (insertIndex !== this.playerState.currentIndex) {
      this.store$.dispatch(setCurrentIndex({currentIndex: insertIndex}));
    }
  }

  // 添加多首歌曲
  insertSongs(songs: Song[]): void {
    const songList = this.playerState.songList.slice();
    const playList = this.playerState.playList.slice();
    songs.forEach(item => {
      const pIndex = findIndex(playList, item);
      if (pIndex === -1) {
        songList.push(item);
        playList.push(item);
      }
    });
    this.store$.dispatch(setSongList({songList}));
    this.store$.dispatch(setPlayList({playList}));
  }

  // 播放列表
  selectPlayList({list, index}: { list: Song[], index: number }): void {
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

    this.store$.dispatch(setSongList({songList}));
    this.store$.dispatch(setPlayList({playList}));
    this.store$.dispatch(setCurrentIndex({currentIndex}));
  }

  // 清空歌曲
  clearSong(): void {
    this.store$.dispatch(setSongList({songList: []}));
    this.store$.dispatch(setPlayList({playList: []}));
    this.store$.dispatch(setCurrentIndex({currentIndex: -1}));
  }

  // 会员弹窗显示隐藏/类型
  controlModal(visible = true, modalType = ModalTypes.Default): void {
    this.store$.dispatch(setModalType({modalType}));
    this.store$.dispatch(setModalVisible({modalVisible: visible}));
  }
}
