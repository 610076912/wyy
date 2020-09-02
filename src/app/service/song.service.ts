import {Injectable} from '@angular/core';
import {API_CONFIG, ServiceModule} from './service.module';
import {observable, Observable, of} from 'rxjs';
import {Singer, Song, SongSheet, SongUrl} from './data-types/common.types';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map, switchMap, toArray} from 'rxjs/operators';

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
    console.log(params);
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
}
