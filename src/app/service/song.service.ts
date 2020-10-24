import {Injectable} from '@angular/core';
import {API_CONFIG, ServiceModule} from './service.module';
import {Observable} from 'rxjs';
import {Lyric, Song, SongUrl} from './data-types/common.types';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';

import {Inject} from '@angular/core';


@Injectable({
  providedIn: ServiceModule
})
export class SongService {

  constructor(
    @Inject(API_CONFIG) private uri,
    private http: HttpClient
  ) {
  }

  getSongUrl(ids: string): Observable<SongUrl[]> {
    const params = new HttpParams().set('id', ids);
    // console.log(params);
    return this.http.get(this.uri + 'song/url', {params})
      .pipe(
        map((res: { data: SongUrl[] }) => res.data)
      );
  }

  getSongList(songs: Song | Song[]): Observable<Song[]> {
    const songArr = Array.isArray(songs) ? songs : [songs];
    const ids = songArr.map(item => item.id).join(',');
    // return new Observable(observer => {
    //   this.getSongUrl(ids).subscribe(urls => {
    //     observer.next(this.generateSongList(songArr, urls));
    //   });
    // });
    return this.getSongUrl(ids).pipe(
      map(urls => this.generateSongList(songArr, urls))
    );
  }

  private generateSongList(songs: Song[], urls: SongUrl[]): Song[] {
    return songs.map(song => {
      const url = urls.find(item => item.id === song.id).url;
      return {...song, url};
    });
  }

  // 获取歌曲详情
  getSongDetail(ids: string): Observable<Song> {
    const params = new HttpParams().set('ids', ids);
    // console.log(params);
    return this.http.get(this.uri + 'song/detail', {params})
      .pipe(
        map((res: { songs: Song }) => res.songs[0])
      );
  }

  // 获取歌词
  getLyric(id: number): Observable<Lyric> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get(this.uri + '/lyric', {params})
      .pipe(
        map((res: { [key: string]: { lyric: string } }): Lyric => {
          try {
            return {
              lyric: res.lrc.lyric,
              tlyric: res.tlyric.lyric
            };
          } catch (err) {
            return {
              lyric: '',
              tlyric: ''
            };
          }
        })
      );
  }
}
