import {createAction, props} from '@ngrx/store';
import {Song} from '../../service/data-types/common.types';
import {PlayMode} from '../../share/wy-ui/wy-player/player-types';

export const setPlaying = createAction(
  '[player] Set playing',
  props<{ playing: boolean }>()
);
export const setPlayList = createAction(
  '[player] Set playList',
  props<{ playList: Song[] }>()
);
export const setSongList = createAction(
  '[player] Set songList',
  props<{ songList: Song[] }>()
);
export const setPlayMode = createAction(
  '[player] Set mode',
  props<{ playMode: PlayMode }>()
);
export const setCurrentIndex = createAction(
  '[player] Set currentIndex',
  props<{ currentIndex: number }>()
);
