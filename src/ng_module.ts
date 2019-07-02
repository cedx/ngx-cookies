import {ModuleWithProviders, NgModule} from '@angular/core';
import {CookieOptions} from './cookie_options';

/** The cookie module. */
@NgModule()
export class NgxCookies {

  /**
   * Creates a module with all the providers and directives.
   * @param defaults The default cookie options.
   */
  static forRoot(defaults: Partial<CookieOptions>): ModuleWithProviders<NgxCookies> {
    return {
      ngModule: NgxCookies,
      providers: [
        {provide: CookieOptions, useValue: new CookieOptions(defaults)}
      ]
    };
  }
}
