import {Injectable} from '@angular/core';
import {API_CONFIG, ServiceModule} from './service.module';
import {Observable} from 'rxjs';
import {Singer, Song, SongSheet} from './data-types/common.types';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map, pluck, switchMap, switchMapTo, toArray} from 'rxjs/operators';

import {Inject} from '@angular/core';
import {SongService} from './song.service';


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

  getSongSheetDetail(id: number): Observable<SongSheet> {
    const params = new HttpParams().set('id', id.toString());
    console.log(params);
    return this.http.get(this.uri + 'playlist/detail', {params})
      .pipe(
        map((res: { playlist: SongSheet }) => res.playlist)
      );
  }

  playSheet(id: number): Observable<Song[]> {
    return this.getSongSheetDetail(id).pipe(
      pluck('tracks'),
      switchMap(tracks => this.songService.getSongList(tracks))
    );
  }
}
