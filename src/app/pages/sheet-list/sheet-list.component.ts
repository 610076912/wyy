import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { log } from 'ng-zorro-antd';
import { SheetList } from 'src/app/service/data-types/common.types';
import { SheetParams, SheetService } from 'src/app/service/sheet.service';

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
    offset: 1,
    limit: 35
  };
  public sheets: SheetList;
  public orderValue = 'hot';
  constructor(
    private route: ActivatedRoute,
    private sheetServe: SheetService
  ) {
    this.listParams.cat = this.route.snapshot.queryParamMap.get('cat') || '全部';
    console.log('this.route.snapshot:', this.route.snapshot);
    this.getList();
  }

  ngOnInit(): void {
  }

  getList(): void {
    this.sheetServe.getSheets(this.listParams).subscribe(res => this.sheets = res);
  }

}
