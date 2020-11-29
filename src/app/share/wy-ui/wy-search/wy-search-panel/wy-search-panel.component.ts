import { Component, OnInit } from '@angular/core';
import {SearchResult} from '../../../../service/data-types/common.types';
import {Router} from '@angular/router';

@Component({
  selector: 'app-wy-search-panel',
  templateUrl: './wy-search-panel.component.html',
  styleUrls: ['./wy-search-panel.component.less']
})
export class WySearchPanelComponent implements OnInit {
  searchResult: SearchResult;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  // 跳转
  toInfo(path: [string, number]): void {
    if (path[1]) {
      this.router.navigate(path);
    }
  }

}
