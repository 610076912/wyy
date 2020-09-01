import { Injectable } from '@angular/core';
import { API_CONFIG, ServiceModule } from './service.module';
import { Observable } from 'rxjs';
import { Banner, HotTag, SongSheet } from './data-types/common.types';
import { HttpClient } from '@angular/common/http';
import { map, switchMap, take, toArray } from 'rxjs/operators';

import { Inject } from '@angular/core';

@Injectable({
  providedIn: ServiceModule
})
export class HomeService {

  constructor(
    @Inject(API_CONFIG) private uri,
    private http: HttpClient,
  ) {
  }

  // 获取banner图数据
  getBanners(): Observable<Banner[]> {
    return this.http.get(this.uri + 'banner')
      .pipe(map((res: { banners: Banner[] }) => res.banners));
  }

  // 获取热门分类
  getHotTags(): Observable<HotTag[]> {
    return this.http.get(this.uri + 'playlist/hot')
      .pipe(
        switchMap((res: { tags: HotTag[] }) => {
          return res.tags.sort((x, y) => x.position - y.position);
        }),
        take(5),
        toArray()
      );
  }

  // 获取歌单
  getPersonalShellList(): Observable<SongSheet[]> {
    return this.http.get(this.uri + 'personalized')
      .pipe(
        switchMap((res: { result: SongSheet[] }) => res.result),
        take(16),
        toArray()
      );
  }
}
