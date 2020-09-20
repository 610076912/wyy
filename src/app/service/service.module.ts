import {InjectionToken, NgModule, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

export const API_CONFIG = new InjectionToken<string>('ApiConfigToken');
export const WINDOW = new InjectionToken('windowToken');


@NgModule({
  declarations: [],
  imports: [],
  providers: [
    {provide: API_CONFIG, useValue: '/api/'},
    {
      provide: WINDOW,
      useFactory(platformId: object): Window | object {
        return isPlatformBrowser(platformId) ? Window : {};
      },
      deps: [PLATFORM_ID]
    }
  ]
})
export class ServiceModule {
}
