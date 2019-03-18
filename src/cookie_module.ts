import {NgModule} from '@angular/core';
import {CookieOptions} from './cookie_options';
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
        CookieOptions.provider,
        Cookies
      ]
    })];
  }
}
