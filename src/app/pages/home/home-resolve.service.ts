import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {Banner, HotTag, Singer, SongSheet} from '../../service/data-types/common.types';
import {HomeService} from '../../service/home.service';
import {SingerService} from '../../service/singer.service';
import {forkJoin, Observable} from 'rxjs';
import {first} from 'rxjs/operators';

type HomeDataType = [Banner[], HotTag[], SongSheet[], Singer[]];

@Injectable()
export class HomeResolverService implements Resolve<HomeDataType> {

  constructor(
    private homeService: HomeService,
    private singerService: SingerService
  ) {
  }

  resolve(): Observable<HomeDataType> {
    return forkJoin([
      this.homeService.getBanners(),
      this.homeService.getHotTags(),
      this.homeService.getPersonalShellList(),
      this.singerService.getSingerList()
    ]).pipe(first());
  }

}
