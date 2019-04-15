import {NgModule} from '@angular/core';
import {CookieOptions} from './cookie_options';
import {Cookies} from './cookies';

/** The cookie module. */
@NgModule({providers: [
  CookieOptions.provider,
  Cookies
]})
export class NgxCookies {}
