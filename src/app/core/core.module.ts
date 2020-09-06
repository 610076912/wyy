import {NgModule, Optional, SkipSelf} from '@angular/core';
import {AppRoutingModule} from '../app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {PagesModule} from '../pages/pages.module';
import {ShareModule} from '../share/share.module';
import {registerLocaleData} from '@angular/common';
import zh from '@angular/common/locales/zh';
import {HttpClientModule} from '@angular/common/http';
import {NZ_I18N, zh_CN} from 'ng-zorro-antd/i18n';
import {ServiceModule} from '../service/service.module';
import {AppStoreModule} from '../store';

registerLocaleData(zh);

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    PagesModule,
    HttpClientModule,
    ShareModule,
    AppRoutingModule,
    AppStoreModule,
    ServiceModule
  ],
  exports: [
    ShareModule,
    AppRoutingModule
  ],
  providers: [{provide: NZ_I18N, useValue: zh_CN}],
})
export class CoreModule {
  constructor(@SkipSelf() @Optional() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule 只能被appModule引入');
    }
  }
}
