import {Component} from '@angular/core';
import {SearchService} from './service/search.service';
import {SearchResult} from './service/data-types/common.types';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'ng-wyy';
  menu = [
    {
      label: '发现',
      path: '/home'
    },
    {
      label: '歌单',
      path: '/sheet'
    }
  ];

  searchResult: SearchResult;

  constructor(
    private searchService: SearchService
  ) {
  }

  onSearch(value): void {
    console.log(value);
    if (value) {
      this.searchService.search(value).subscribe(res => {
        this.searchResult = res;
      });
    } else {
      this.searchResult = {};
    }
  }
}
