import {Injectable} from '@angular/core';
import {API_CONFIG, ServiceModule} from './service.module';
import {Observable} from 'rxjs';
import {SearchResult} from './data-types/common.types';
import {HttpClient, HttpParams} from '@angular/common/http';

import {Inject} from '@angular/core';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: ServiceModule
})
export class SearchService {

  constructor(
    @Inject(API_CONFIG) private uri,
    private http: HttpClient,
  ) {
  }

  search(keywords: string): Observable<SearchResult> {
    const params = new HttpParams().set('keywords', keywords);
    return this.http.get(this.uri + 'search/suggest', {params})
      .pipe(map((res: { result: SearchResult }) => res.result));
  }

}
