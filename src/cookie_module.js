import {APP_BASE_HREF} from '@angular/common';
import {Injector, NgModule} from '@angular/core';

import {CookieOptions, COOKIE_OPTIONS} from './cookie_options';
import {Cookies} from './cookies';

/**
 * The cookie module.
 */
export class CookieModule {

  /**
   * The class decorators.
   * @type {Array}
   */
  static get annotations() {
    return [new NgModule({
      providers: [
        {provide: COOKIE_OPTIONS, useFactory: injector => new CookieOptions(null, injector.get(APP_BASE_HREF, '/')), deps: [Injector]},
        Cookies
      ]
    })];
  }
}
