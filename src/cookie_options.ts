import {APP_BASE_HREF} from '@angular/common';
import {InjectionToken, Injector} from '@angular/core';

/**
 * An injection token representing the default cookie options.
 * @type {InjectionToken}
 */
export const COOKIE_OPTIONS = new InjectionToken('COOKIE_OPTIONS');

/**
 * Defines the attributes of a HTTP cookie.
 */
export class CookieOptions {

  /**
   * The service provider.
   * @type {object}
   */
  static get provider() {
    return {
      provide: COOKIE_OPTIONS,
      useFactory: injector => new CookieOptions({path: injector.get(APP_BASE_HREF, '/')}),
      deps: [Injector]
    };
  }

  /**
   * Initializes a new instance of the class.
   * @param {object} [options] An object specifying values used to initialize this instance.
   */
  constructor({domain = '', expires = null, path = '', secure = false} = {}) {

    /**
     * The domain for which the cookie is valid.
     * @type {string}
     */
    this.domain = domain;

    /**
     * The expiration date and time for the cookie.
     * @type {Date}
     */
    this.expires = expires instanceof Date ? expires : null;
    if (!this.expires && (Number.isInteger(expires) || typeof expires == 'string')) this.expires = new Date(expires);

    /**
     * The path to which the cookie applies.
     * @type {string}
     */
    this.path = path;

    /**
     * Value indicating whether to transmit the cookie over HTTPS only.
     * @type {boolean}
     */
    this.secure = secure;
  }

  /**
   * The class name.
   * @type {string}
   */
  get [Symbol.toStringTag]() {
    return 'CookieOptions';
  }

  /**
   * Converts this object to a map in JSON format.
   * @return {object} The map in JSON format corresponding to this object.
   */
  toJSON() {
    return {
      domain: this.domain,
      expires: this.expires ? this.expires.toISOString() : null,
      path: this.path,
      secure: this.secure
    };
  }

  /**
   * Returns a string representation of this object.
   * @return {string} The string representation of this object.
   */
  toString() {
    let value = [];
    if (this.expires) value.push(`expires=${this.expires.toUTCString()}`);
    if (this.domain.length) value.push(`domain=${this.domain}`);
    if (this.path.length) value.push(`path=${this.path}`);
    if (this.secure) value.push('secure');
    return value.join('; ');
  }
}
