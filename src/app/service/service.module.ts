import {InjectionToken, NgModule} from '@angular/core';

export const API_CONFIG = new InjectionToken<string>('ApiConfigToken');


@NgModule({
  declarations: [],
  imports: [],
  providers: [
    {provide: API_CONFIG, useValue: '/api/'}
  ]
})
export class ServiceModule {
}
