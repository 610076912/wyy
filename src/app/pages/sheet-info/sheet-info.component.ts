import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { SongSheet } from '../../service/data-types/common.types';

@Component({
  selector: 'app-sheet-info',
  templateUrl: './sheet-info.component.html',
  styleUrls: ['./sheet-info.component.less']
})
export class SheetInfoComponent implements OnInit {
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

  constructor(
    private route: ActivatedRoute
  ) {
    this.route.data.pipe(map(res => res.sheetInfo)).subscribe(res => {
      this.sheetInfo = res;
      if (res.description) {
        this.changeDesc(res.description);
      }
    });
  }

  ngOnInit(): void {
  }

  changeDesc(desc: string): void {
    if (desc.length < 99) {
      this.description.short = '<b>介绍: </b>' + desc;
    } else {
      const str = '<b>介绍: </b>' + desc.replace(/\n/g, '<br/>');
      this.description = {
        short: str.slice(0, 99) + '...',
        long: str
      };
    }
  }

}
