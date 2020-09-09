import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Song} from '../../../../service/data-types/common.types';

@Component({
  selector: 'app-wy-player-panel',
  templateUrl: './wy-player-panel.component.html',
  styleUrls: ['./wy-player-panel.component.less']
})
export class WyPlayerPanelComponent implements OnInit, OnChanges {

  @Input() songList: Song[];
  @Input() currentSong: Song;
  @Input() currentIndex: number;
  @Input() show = true;

  @Output() closePanel = new EventEmitter<void>();
  @Output() changeSong = new EventEmitter<Song>();

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['songList']) {
      console.log(this.songList);
    }
    if (changes['currentSong']) {
      console.log(this.songList);
    }
  }

}
