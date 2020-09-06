import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppStoreModule} from '../../../store';
import {getCurrentIndex, getCurrentSong, getPlayList, getPlayMode, getSongList} from '../../../store/selectors/player.selectors';
import {Song} from '../../../service/data-types/common.types';
import {PlayMode} from './player-types';

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less']
})
export class WyPlayerComponent implements OnInit, AfterViewInit {

  public sliderValue = 35;

  songList: Song[];
  playList: Song[];
  currentIndex: number;
  playMode: PlayMode;
  currentSong: Song;

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
      {type: getCurrentSong, cb: (song) => this.watchCurrentSong(song)},
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
    console.log(mode);
  }

  watchCurrentSong(song: Song): void {
    this.currentSong = song;
    console.log(song);
  }

  onCanPlay(): void {
    this.play();
  }

  private play(): void {
    this.audioEl.play();
  }

}
