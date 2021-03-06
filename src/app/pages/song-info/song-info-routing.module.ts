import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SongInfoComponent} from './song-info.component';
import {SongInfoResolverService} from './song-info-resolver.service';

const routes: Routes = [
  {
    path: 'songInfo/:id',
    component: SongInfoComponent,
    data: {title: '歌单详情'},
    resolve: {songInfo: SongInfoResolverService}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [SongInfoResolverService]
})
export class SongInfoRoutingModule {
}
