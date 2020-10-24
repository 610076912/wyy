import {Injectable} from '@angular/core';
import {API_CONFIG, ServiceModule} from './service.module';
import {Observable} from 'rxjs';
import {Singer, SingerDetail} from './data-types/common.types';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map, switchMap, toArray} from 'rxjs/operators';
import queryString from 'querystring';

import {Inject} from '@angular/core';

type SingerParams = {
  offset: number;
  limit: number;
  cat?: string;
};
const defaultSingerParams = {
  offset: 0,
  limit: 9,
  cat: '5001'
};

@Injectable({
  providedIn: ServiceModule
})
export class SingerService {

  constructor(
    @Inject(API_CONFIG) private uri,
    private http: HttpClient
  ) {
  }

  getSingerList(args: SingerParams = defaultSingerParams): Observable<Singer[]> {
    const params = new HttpParams({fromString: queryString.stringify(args)});
    return this.http.get(this.uri + 'artist/list', {params})
      .pipe(
        switchMap((res: { artists: Singer[] }) => res.artists),
        toArray()
      );
  }

  // 获取歌手详情和热门歌曲
  getSingerDetail(id: string): Observable<SingerDetail> {
    const params = new HttpParams().set('id', id);
    return this.http.get(this.uri + 'artists', {params})
      .pipe(map(res => res as SingerDetail));
  }

  // 获取相似歌手列表
  getSimiSinger(id: string): Observable<Singer[]> {
    const params = new HttpParams().set('id', id);
    return this.http.get(this.uri + 'simi/artist', {params})
      .pipe(map((res: { artists: Singer[] }) => res.artists));
  }
}
