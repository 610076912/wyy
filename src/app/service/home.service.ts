import {Injectable} from '@angular/core';
import {API_CONFIG, ServiceModule} from './service.module';
import {Observable} from 'rxjs';
import {Banner} from './data-types/common.types';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

import {Inject} from '@angular/core';

@Injectable({
  providedIn: ServiceModule
})
export class HomeService {

  constructor(
    @Inject(API_CONFIG) private uri,
    private http: HttpClient,
  ) {
  }

  getBanners(): Observable<Banner[]> {
    return this.http.get(this.uri + 'banner')
      .pipe(map((res: { banners: Banner[] }) => res.banners));
  }
}
