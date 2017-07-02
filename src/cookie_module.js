import {APP_BASE_HREF} from '@angular/common';
import {NgModule} from '@angular/core';

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
        {provide: COOKIE_OPTIONS, useFactory: APP_BASE_HREF => new CookieOptions(null, APP_BASE_HREF), deps: [APP_BASE_HREF]},
        Cookies
      ]
    })];
  }
}
