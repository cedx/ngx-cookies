import {DOCUMENT} from '@angular/common';
import {Inject, Injectable, SimpleChange, SimpleChanges} from '@angular/core';
import {Subject} from 'rxjs';
import {CookieOptions, COOKIE_OPTIONS} from './cookie_options';
import {JsonMap} from './map';

/**
 * Provides access to the HTTP cookies.
 * See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
 */
@Injectable({providedIn: 'root'})
export class Cookies {

  /**
   * TODO: The constructor parameters.
   */
  static get parameters() {
    return [COOKIE_OPTIONS, DOCUMENT];
  }

  /**
   * The class name.
   */
  readonly [Symbol.toStringTag]: string = 'Cookies';

  /**
   * The default cookie options.
   */
  readonly defaults: CookieOptions;

  /**
   * The handler of "changes" events.
   */
  private _onChanges: Subject<SimpleChanges> = new Subject;

  /**
   * Creates a new cookie service.
   * @param defaults The default cookie options.
   * @param _document The underlying HTML document.
   */
  constructor(defaults: Partial<CookieOptions> = {}, @Inject(DOCUMENT) private _document: Document = window.document) {
    this.defaults = defaults instanceof CookieOptions ? defaults : new CookieOptions(defaults);
  }

  /**
   * The keys of the cookies associated with the current document.
   */
  get keys(): string[] {
    const keys = this._document.cookie.replace(/((?:^|\s*;)[^=]+)(?=;|$)|^\s*|\s*(?:=[^;]*)?(?:\1|$)/g, '');
    return keys.length ? keys.split(/\s*(?:=[^;]*)?;\s*/).map(key => decodeURIComponent(key)) : [];
  }

  /**
   * The number of cookies associated with the current document.
   */
  get length(): number {
    return this.keys.length;
  }

  /**
   * The stream of "changes" events.
   * @type {Observable<KeyValueChangeRecord[]>}
   */
  get onChanges() {
    return this._onChanges.asObservable();
  }

  /**
   * Returns a new iterator that allows iterating the cookies associated with the current document.
   */
  *[Symbol.iterator](): IterableIterator<[string, string | undefined]> {
    for (const key of this.keys) yield [key, this.get(key)];
  }

  /**
   * Removes all cookies associated with the current document.
   * @emits {KeyValueChangeRecord[]} The "changes" event.
   */
  clear() {
    let changes = this.keys.map(key => ({currentValue: null, key, previousValue: this.get(key)}));
    for (let key of this.keys) this._removeItem(key);
    this._onChanges.next(changes);
  }

  /**
   * Gets the value associated to the specified key.
   * @param key The cookie name.
   * @param defaultValue The default cookie value if it does not exist.
   * @return The cookie value, or the default value if the item is not found.
   */
  get(key: string, defaultValue?: string): string | undefined {
    if (!this.has(key)) return defaultValue;

    try {
      const token = encodeURIComponent(key).replace(/[-.+*]/g, '\\$&');
      const scanner = new RegExp(`(?:(?:^|.*;)\\s*${token}\\s*\=\\s*([^;]*).*$)|^.*$`);
      return decodeURIComponent(this._document.cookie.replace(scanner, '$1'));
    }

    catch (err) {
      return defaultValue;
    }
  }

  /**
   * Gets the deserialized value associated to the specified key.
   * @param key The cookie name.
   * @param defaultValue The default cookie value if it does not exist.
   * @return The deserialized cookie value, or the default value if the item is not found.
   */
  getObject<T>(key: string, defaultValue?: T): T | undefined {
    try {
      const value = this.get(key);
      return typeof value == 'string' ? JSON.parse(value) : defaultValue;
    }

    catch (err) {
      return defaultValue;
    }
  }

  /**
   * Gets a value indicating whether the current document has a cookie with the specified key.
   * @param key The cookie name.
   * @return `true` if the current document has a cookie with the specified key, otherwise `false`.
   */
  has(key: string): boolean {
    const token = encodeURIComponent(key).replace(/[-.+*]/g, '\\$&');
    return new RegExp(`(?:^|;\\s*)${token}\\s*\=`).test(this._document.cookie);
  }

  /**
   * Removes the value associated to the specified key.
   * @param {string} key The cookie name.
   * @param {CookieOptions} [options] The cookie options.
   * @emits {KeyValueChangeRecord[]} The "changes" event.
   */
  remove(key, options = this.defaults) {
    let previousValue = this.get(key);
    this._removeItem(key, options);
    this._onChanges.next([{currentValue: null, key, previousValue}]);
  }

  /**
   * Associates a given value to the specified key.
   * @param {string} key The cookie name.
   * @param {string} value The cookie value.
   * @param {CookieOptions|Date} [options] The cookie options, or the expiration date and time for the cookie.
   * @throws {TypeError} The specified key is invalid.
   * @emits {KeyValueChangeRecord[]} The "changes" event.
   */
  set(key, value, options = this.defaults) {
    if (!key.length || /^(domain|expires|max-age|path|secure)$/i.test(key)) throw new TypeError('Invalid cookie name.');

    let cookieValue = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    if (options instanceof Date) options = new CookieOptions({
      domain: this.defaults.domain,
      expires: options,
      path: this.defaults.path,
      secure: this.defaults.secure
    });

    if (options.toString().length) cookieValue += `; ${options}`;

    let previousValue = this.get(key);
    this._document.cookie = cookieValue;
    this._onChanges.next([{currentValue: value, key, previousValue}]);
  }

  /**
   * Serializes and associates a given value to the specified key.
   * @param key The cookie name.
   * @param value The cookie value.
   * @param options The cookie options.
   * @return This instance.
   */
  setObject(key: string, value: any, options: Partial<CookieOptions> = {}): this {
    this.set(key, JSON.stringify(value), options);
    return this;
  }

  /**
   * Converts this object to a map in JSON format.
   * @return The map in JSON format corresponding to this object.
   */
  toJSON(): JsonMap {
    const map = {} as JsonMap;
    for (const [key, value] of this) map[key] = value;
    return map;
  }

  /**
   * Returns a string representation of this object.
   * @return The string representation of this object.
   */
  toString(): string {
    return this._document.cookie;
  }

  /**
   * Merges the default cookie options with the specified ones.
   * @param options The options to merge with the defaults.
   * @return The resulting cookie options.
   */
  private _getOptions(options: Partial<CookieOptions> = {}): CookieOptions {
    return new CookieOptions({
      domain: typeof options.domain == 'string' && options.domain.length ? options.domain : this.defaults.domain,
      expires: typeof options.expires == 'object' && options.expires ? options.expires : this.defaults.expires,
      path: typeof options.path == 'string' && options.path.length ? options.path : this.defaults.path,
      secure: typeof options.secure == 'boolean' && options.secure ? options.secure : this.defaults.secure
    });
  }

  /**
   * Removes the value associated to the specified key.
   * @param key The cookie name.
   * @param options The cookie options.
   */
  private _removeItem(key: string, options: Partial<CookieOptions> = {}): void {
    if (!this.has(key)) return;
    const cookieOptions = this._getOptions(options);
    cookieOptions.expires = new Date(0);
    this._document.cookie = `${encodeURIComponent(key)}=; ${cookieOptions}`;
  }
}
