import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SongSheet} from '../../../service/data-types/common.types';

@Component({
  selector: 'app-single-sheet',
  templateUrl: './single-sheet.component.html',
  styleUrls: ['./single-sheet.component.less']
})
export class SingleSheetComponent implements OnInit {
  @Input() sheet: SongSheet;
  @Output() sheetPlay: EventEmitter<number> = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  playSheet(id: number): void {
    this.sheetPlay.emit(id);
  }

}
