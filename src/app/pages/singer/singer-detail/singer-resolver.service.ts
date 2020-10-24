import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {SingerDetail} from '../../../service/data-types/common.types';
import {SingerService} from '../../../service/singer.service';


@Injectable()
export class SingerResolverService implements Resolve<SingerDetail> {
  constructor(
    private singerService: SingerService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<SingerDetail> {
    const id = route.paramMap.get('id');
    return this.singerService.getSingerDetail(id);
  }
}
