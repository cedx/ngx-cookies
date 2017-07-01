import {Injectable} from '@angular/core';
import {DOCUMENT} from '@angular/platform-browser';
import {Subject} from 'rxjs/Subject';
import {COOKIE_OPTIONS} from './cookie_options';

/**
 * Provides access to the HTTP cookies.
 * See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
 */
export class Cookies {

  /**
   * The class decorators.
   * @type {Array}
   */
  static get annotations() {
    return [new Injectable];
  }

  /**
   * The constructor parameters.
   * @type {Array}
   */
  static get parameters() {
    return [COOKIE_OPTIONS, DOCUMENT];
  }

  /**
   * Initializes a new instance of the class.
   * @param {CookieOptions} cookieOptions The default cookie options.
   * @param {HTMLDocument} document The underlying HTML document.
   */
  constructor(cookieOptions, document) {

    /**
     * The default cookie options.
     * @type {CookieOptions}
     */
    this._defaultOptions = cookieOptions;

    /**
     * The underlying HTML document.
     * @type {HTMLDocument}
     */
    this._document = document;

    /**
     * The handler of "changes" events.
     * @type {Subject<KeyValueChangeRecord>}
     */
    this._onChanges = new Subject;
  }

  /**
   * The keys of the cookies associated with the current document.
   * @type {string[]}
   */
  get keys() {
    let keys = this._document.cookie.replace(/((?:^|\s*;)[^=]+)(?=;|$)|^\s*|\s*(?:=[^;]*)?(?:\1|$)/g, '').split(/\s*(?:=[^;]*)?;\s*/);
    return keys.map(key => decodeURIComponent(key));
  }

  /**
   * The number of cookies associated with the current document.
   * @type {number}
   */
  get length() {
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
  *[Symbol.iterator]() {
    for (let key of this.keys) yield [key, this.get(key)];
  }

  /**
   * Removes all cookies associated with the current document.
   */
  clear() {
    let changes = this.keys.map(key => ({currentValue: null, key, previousValue: this.get(key)}));
    for (let key of this.keys) this._removeItem(key);
    this._onChanges.next(changes);
  }

  /**
   * Gets the value associated to the specified key.
   * @param {string} key The cookie name.
   * @param {*} defaultValue The default cookie value if it does not exist.
   * @return {string} The cookie value, or the default value if the item is not found.
   */
  get(key, defaultValue = null) {
    // TODO: if (!this.has(key)) return defaultValue;

    try {
      let token = encodeURIComponent(key).replace(/[-.+*]/g, '\\$&');
      let scanner = new RegExp(`(?:(?:^|.*;)\\s*${token}\\s*\\=\\s*([^;]*).*$)|^.*$`);
      return decodeURIComponent(this._document.cookie.replace(scanner, '$1'));
    }

    catch (err) {
      return defaultValue;
    }
  }

  /**
   * Gets the deserialized value associated to the specified key.
   * @param {string} key The cookie name.
   * @param {*} defaultValue The default cookie value if it does not exist.
   * @return {*} The deserialized cookie value, or the default value if the item is not found.
   */
  getObject(key, defaultValue = null) {
    try {
      let value = this.get(key);
      return typeof value == 'string' ? JSON.parse(value) : defaultValue;
    }

    catch (err) {
      return defaultValue;
    }
  }

  /**
   * Gets a value indicating whether the current document has a cookie with the specified key.
   * @param {string} key The cookie name.
   * @return {boolean} `true` if the current document has a cookie with the specified key, otherwise `false`.
   */
  has(key) {
    let token = encodeURIComponent(key).replace(/[-.+*]/g, '\\$&');
    return new RegExp(`(?:^|;\\s*)${token}\\s*\\=`).test(this._document.cookie);
  }

  /**
   * Removes the value associated to the specified key.
   * @param {string} key The cookie name.
   * @param {CookieOptions} [options] The cookie options.
   */
  remove(key, options = null) {
    let previousValue = this.get(key);
    this._removeItem(key, options);
    this._onChanges.next([{currentValue: null, key, previousValue}]);
  }

  /**
   * Associates a given value to the specified key.
   * @param {string} key The cookie name.
   * @param {string} value The cookie value.
   * @param {CookieOptions} [options] The cookie options.
   * @throws {TypeError} The specified key is invalid.
   */
  set(key, value, options = null) {
    if (!key.length || /^(?:domain|expires|max-age|path|secure)$/i.test(key)) throw new TypeError('Invalid cookie name.');

    let cookieValue = [`${encodeURIComponent(key)}=${encodeURIComponent(value)}`];
    let cookieOptions = Object.assign(this._defaultOptions.toJSON(), options ? options.toJSON() : {});
    if ('expires' in cookieOptions) cookieValue.push(`expires=${cookieOptions.expires}`);
    if ('domain' in cookieOptions) cookieValue.push(`domain=${cookieOptions.domain}`);
    if ('path' in cookieOptions) cookieValue.push(`path=${cookieOptions.path}`);
    if ('secure' in cookieOptions && cookieOptions.secure) cookieValue.push('secure');

    let previousValue = this.get(key);
    this._document.cookie = cookieValue.join('; ');
    this._onChanges.next([{currentValue: value, key, previousValue}]);
  }

  /**
   * Serializes and associates a given value to the specified key.
   * @param {string} key The cookie name.
   * @param {*} value The cookie value.
   * @param {CookieOptions} [options] The cookie options.
   */
  setObject(key, value, options = null) {
    this.set(key, JSON.stringify(value), options);
  }

  /**
   * Removes the value associated to the specified key.
   * @param {string} key The cookie name.
   * @param {CookieOptions} [options] The cookie options.
   */
  _removeItem(key, options = null) {
    if (!this.has(key)) return;

    let cookieValue = [
      `${encodeURIComponent(key)}=`,
      `expires=${new Date(0).toUTCString()}`
    ];

    let cookieOptions = Object.assign(this._defaultOptions.toJSON(), options ? options.toJSON() : {});
    if ('domain' in cookieOptions) cookieValue.push(`domain=${cookieOptions.domain}`);
    if ('path' in cookieOptions) cookieValue.push(`path=${cookieOptions.path}`);

    this._document.cookie = cookieValue.join('; ');
  }
}