import {Component, OnInit, ViewChild} from '@angular/core';
import {HomeService} from '../../service/home.service';
import {SingerService} from '../../service/singer.service';
import {Banner, HotTag, Singer, SongSheet} from '../../service/data-types/common.types';
import {NzCarouselComponent} from 'ng-zorro-antd/carousel';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/operators';
import {SheetService} from '../../service/sheet.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  public carouselActiveIndex = 0;
  public banners: Banner[];
  public hotTags: HotTag[];
  public songSheetList: SongSheet[];
  public singerList: Singer[];
  @ViewChild(NzCarouselComponent, {static: true}) private nzCarousel: NzCarouselComponent;

  constructor(
    private homeService: HomeService,
    private singerService: SingerService,
    private sheetService: SheetService,
    private route: ActivatedRoute
  ) {
    this.route.data.pipe(
      map(res => res.homeData)
    ).subscribe(([banners, hotTags, songSheetList, singerList]) => {
      this.banners = banners;
      this.hotTags = hotTags;
      this.songSheetList = songSheetList;
      this.singerList = singerList;
    });
    // this.getBanners();
    // this.getHotTags();
    // this.getSongSheets();
    // this.getSingerList();
  }

  // 获取banner图
  private getBanners(): void {
    this.homeService.getBanners().subscribe(banners => {
      this.banners = banners;
    });
  }

  // 获取HotTags
  private getHotTags(): void {
    this.homeService.getHotTags().subscribe(hotTags => {
      this.hotTags = hotTags;
      console.log(this.hotTags);
    });
  }

  // 获取歌单
  private getSongSheets(): void {
    this.homeService.getPersonalShellList().subscribe(result => {
      this.songSheetList = result;
      console.log(this.songSheetList);
    });
  }

  // 获取歌手列表
  private getSingerList(): void {
    this.singerService.getSingerList().subscribe(res => {
      console.log(res);
      this.singerList = res;
    });
  }

  ngOnInit(): void {

  }

  onBeforeChange({to}: { to: number }): void {
    this.carouselActiveIndex = to;
  }

  onChangeSlide(type): void {
    this.nzCarousel[type]();
  }

  onPlaySheet(id): void {
    this.sheetService.playSheet(id).subscribe(res => {
      console.log(res);
    });
  }

}
