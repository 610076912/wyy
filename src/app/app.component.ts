import {Component} from '@angular/core';
import {SearchService} from './service/search.service';
import {SearchResult} from './service/data-types/common.types';
import {isEmptyObject} from './utils/tools';


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
        this.searchResult = this.highlightKeyWords(value, res);
      });
    } else {
      this.searchResult = {};
    }
  }

  private highlightKeyWords(keywords: string, result: SearchResult): SearchResult {
    if (!isEmptyObject(result)) {
      const reg = new RegExp(keywords, 'ig');
      ['artists', 'playlists', 'songs'].forEach(type => {
        if (result[type]) {
          result[type].forEach(item => {
            item.name = item.name.replace(reg, '<span class="highlight">$&</span>');
          });
        }
      });
    }
    console.log('result:', result);
    return result;
  }
}
