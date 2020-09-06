import { Injectable } from '@angular/core';
import { API_CONFIG, ServiceModule } from './service.module';
import { Observable } from 'rxjs';
import { Singer } from './data-types/common.types';
import { HttpClient, HttpParams } from '@angular/common/http';
import { switchMap, toArray } from 'rxjs/operators';
import queryString from 'querystring';

import { Inject } from '@angular/core';

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
}
