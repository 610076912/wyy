import { Injectable } from '@angular/core';
import { API_CONFIG, ServiceModule } from './service.module';
import { Observable } from 'rxjs';
import { SheetList, Singer, Song, SongSheet } from './data-types/common.types';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, pluck, switchMap, switchMapTo, toArray } from 'rxjs/operators';

import { Inject } from '@angular/core';
import { SongService } from './song.service';
import queryString from 'querystring';

export type SheetParams = {
  offset: number;
  limit: number;
  order: 'new' | 'hot';
  cat: string;
}
@Injectable({
  providedIn: ServiceModule
})
export class SheetService {

  constructor(
    @Inject(API_CONFIG) private uri,
    private http: HttpClient,
    private songService: SongService,
  ) {
  }

  getSheets(args: SheetParams): Observable<SheetList> {
    const params = new HttpParams({ fromString: queryString.stringify(args) });
    return this.http.get(this.uri + 'top/playlist', { params }).pipe(
      map(res => res as SheetList)
    );
  }

  getSongSheetDetail(id: number): Observable<SongSheet> {
    const params = new HttpParams().set('id', id.toString());
    console.log(params);
    return this.http.get(this.uri + 'playlist/detail', { params })
      .pipe(
        map((res: { playlist: SongSheet }) => res.playlist)
      );
  }

  playSheet(id: number): Observable<Song[]> {
    return this.getSongSheetDetail(id).pipe(
      pluck('tracks'),  // 获取流中的某个属性值
      switchMap(tracks => {
        // console.log('tracks', tracks);歌曲信息（不包含url）
        return this.songService.getSongList(tracks);
      })
    );
  }
}
