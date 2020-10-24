import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { log } from 'ng-zorro-antd';
import { SheetList } from 'src/app/service/data-types/common.types';
import { SheetParams, SheetService } from 'src/app/service/sheet.service';
import { BatchActionService } from '../../store/batch-action.service';

@Component({
  selector: 'app-sheet-list',
  templateUrl: './sheet-list.component.html',
  styleUrls: ['./sheet-list.component.less']
})
export class SheetListComponent implements OnInit {
  // 默认参数
  public listParams: SheetParams = {
    cat: '全部',
    order: 'hot',
    offset: 0,
    limit: 35
  };
  public sheets: SheetList;
  public orderValue = 'hot';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sheetServe: SheetService,
    private sheetService: SheetService,
    private batchActionServe: BatchActionService
  ) {
    this.listParams.cat = this.route.snapshot.queryParamMap.get('cat') || '全部';
    this.getList();
  }

  ngOnInit(): void {
  }

  getList(): void {
    this.sheetServe.getSheets(this.listParams).subscribe(res => this.sheets = res);
  }

  onPlaySheet(id: number): void {
    this.sheetService.playSheet(id).subscribe(list => {
      this.batchActionServe.selectPlayList({list, index: 0});
    });
  }

  onOrderChange(order: 'hot' | 'new'): void {
    this.listParams.order = order;
    this.listParams.offset = 0;
    this.getList();
  }

  onPageChange(page: number): void {
    this.listParams.offset = (page - 1) * this.listParams.limit;
    this.getList();
  }

  // 跳转到歌单详情
  toInfo(id: number): void {
    this.router.navigate(['/sheetInfo', id]);
  }

}
