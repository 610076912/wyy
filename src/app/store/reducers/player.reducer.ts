import {PlayMode} from '../../share/wy-ui/wy-player/player-types';
import {Song} from '../../service/data-types/common.types';
import {Action, createReducer, on} from '@ngrx/store';
import {setCurrentIndex, setPlaying, setPlayList, setPlayMode, setSongList} from '../actions/player.actions';

export interface PlayState {
  // 播放状态
  playing: boolean;

  // 播放模式
  playMode: PlayMode;

  // 歌曲列表
  songList: Song[];

  // 播放列表
  playList: Song[];

  // 当前正在播放的索引
  currentIndex: number;

  // 当前操作
  currentAction?: string;
}

export const initialState: PlayState = {
  // 播放状态
  playing: false,
  // 播放模式
  playMode: {type: 'loop', label: '循环'},
  // 歌曲列表
  songList: [],
  // 播放列表
  playList: [],
  // 当前正在播放的索引
  currentIndex: -1
};

const reducer = createReducer(
  initialState,
  on(setPlaying, (state, {playing}) => ({...state, playing})),
  on(setPlayList, (state, {playList}) => ({...state, playList})),
  on(setSongList, (state, {songList}) => ({...state, songList})),
  on(setPlayMode, (state, {playMode}) => ({...state, playMode})),
  on(setCurrentIndex, (state, {currentIndex}) => ({...state, currentIndex})),
);


export function playerReducer(state: PlayState | undefined, action: Action): PlayState {
  return reducer(state, action);
}

/*
export const SetPlaying = createAction('[player] Set playing', props<{ playing: boolean }>());
export const SetPlayList = createAction('[player] Set playList', props<{ list: Song[] }>());
export const SetSongList = createAction('[player] Set songList', props<{ list: Song[] }>());
export const SetPlayMode = createAction('[player] Set mode', props<{ mode: PlayMode }>());
export const SetCurrentIndex = createAction('[player] Set currentIndex', props<{ index: number }>());

* */
