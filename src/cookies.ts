import {isPlatformBrowser} from '@angular/common';
import {Inject, Injectable, Optional, PLATFORM_ID, SimpleChange, SimpleChanges} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {CookieOptions} from './options';
import {JsonObject} from './json_object';

/**
 * Provides access to the [HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies).
 * @dynamic
 */
@Injectable({providedIn: 'root'})
export class Cookies implements Iterable<[string, string|undefined]> {

  /** The default cookie options. */
  readonly defaults: CookieOptions;

  /** The underlying HTML document. */
  private _document: CookieProvider;

  /** The handler of "changes" events. */
  private _onChanges: Subject<SimpleChanges> = new Subject<SimpleChanges>();

  /**
   * Creates a new cookie service.
   * @param defaults The default cookie options.
   * @param platformId The identifier of the current platform.
   */
  constructor(@Optional() @Inject(CookieOptions) defaults: CookieOptions|null, @Inject(PLATFORM_ID) platformId: Object) {
    this.defaults = defaults ? defaults : new CookieOptions;
    this._document = isPlatformBrowser(platformId) ? document : {cookie: ''}; // TODO Implements the cookie provider.
  }

  /** The keys of the cookies associated with the current document. */
  get keys(): string[] {
    const keys = this._document.cookie.replace(/((?:^|\s*;)[^=]+)(?=;|$)|^\s*|\s*(?:=[^;]*)?(?:\1|$)/g, '');
    return keys.length ? keys.split(/\s*(?:=[^;]*)?;\s*/).map(decodeURIComponent) : [];
  }

  /** The number of cookies associated with the current document. */
  get length(): number {
    return this.keys.length;
  }

  /** The stream of "changes" events. */
  get onChanges(): Observable<SimpleChanges> {
    return this._onChanges.asObservable();
  }

  /**
   * Returns a new iterator that allows iterating the cookies associated with the current document.
   * @return An iterator for the cookies of the current document.
   */
  *[Symbol.iterator](): IterableIterator<[string, string|undefined]> {
    for (const key of this.keys) yield [key, this.get(key)];
  }

  /** Removes all cookies associated with the current document. */
  clear(): void {
    const changes: SimpleChanges = {};
    for (const [key, value] of this) {
      changes[key] = new SimpleChange(value, undefined, false);
      this._removeItem(key);
    }

    this._onChanges.next(changes);
  }

  /**
   * Gets the value associated to the specified key.
   * @param key The cookie name.
   * @param defaultValue The value to return if the cookie does not exist.
   * @return The cookie value, or the default value if the cookie is not found.
   */
  get(key: string, defaultValue?: string): string|undefined {
    if (!this.has(key)) return defaultValue;

    try {
      const token = encodeURIComponent(key).replace(/[-.+*]/g, '\\$&');
      const scanner = new RegExp(`(?:(?:^|.*;)\\s*${token}\\s*=\\s*([^;]*).*$)|^.*$`);
      return decodeURIComponent(this._document.cookie.replace(scanner, '$1'));
    }

    catch (err) {
      return defaultValue;
    }
  }

  /**
   * Gets the deserialized value associated to the specified key.
   * @param key The cookie name.
   * @param defaultValue The value to return if the cookie does not exist.
   * @return The deserialized cookie value, or the default value if the cookie is not found.
   */
  getObject(key: string, defaultValue?: any): any {
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
    return new RegExp(`(?:^|;\\s*)${token}\\s*=`).test(this._document.cookie);
  }

  /**
   * Removes the cookie with the specified key and its associated value.
   * @param key The cookie name.
   * @param options The cookie options.
   * @return The value associated with the specified key before it was removed.
   */
  remove(key: string, options?: CookieOptions): string|undefined {
    const previousValue = this.get(key);
    this._removeItem(key, options);
    this._onChanges.next({
      [key]: new SimpleChange(previousValue, undefined, false)
    });

    return previousValue;
  }

  /**
   * Associates a given value to the specified key.
   * @param key The cookie name.
   * @param value The cookie value.
   * @param options The cookie options.
   * @return This instance.
   * @throws [[TypeError]] The specified key is invalid.
   */
  set(key: string, value: string, options?: CookieOptions): this {
    if (!key.length || /^(domain|expires|max-age|path|secure)$/i.test(key)) throw new TypeError('Invalid cookie name.');

    const cookieOptions = this._getOptions(options).toString();
    let cookieValue = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    if (cookieOptions.length) cookieValue += `; ${cookieOptions}`;

    const previousValue = this.get(key);
    this._document.cookie = cookieValue;
    this._onChanges.next({
      [key]: new SimpleChange(previousValue, value, false)
    });

    return this;
  }

  /**
   * Serializes and associates a given value to the specified key.
   * @param key The cookie name.
   * @param value The cookie value.
   * @param options The cookie options.
   * @return This instance.
   */
  setObject(key: string, value: any, options?: CookieOptions): this {
    return this.set(key, JSON.stringify(value), options);
  }

  /**
   * Converts this object to a map in JSON format.
   * @return The map in JSON format corresponding to this object.
   */
  toJSON(): JsonObject {
    const map: JsonObject = {};
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
  private _getOptions(options: CookieOptions = new CookieOptions): CookieOptions {
    return new CookieOptions({
      domain: options.domain.length ? options.domain : this.defaults.domain,
      expires: options.expires ? options.expires : this.defaults.expires,
      path: options.path.length ? options.path : this.defaults.path,
      secure: options.secure ? options.secure : this.defaults.secure
    });
  }

  /**
   * Removes the value associated to the specified key.
   * @param key The cookie name.
   * @param options The cookie options.
   */
  private _removeItem(key: string, options?: CookieOptions): void {
    if (!this.has(key)) return;
    const cookieOptions = this._getOptions(options);
    cookieOptions.expires = new Date(0);
    this._document.cookie = `${encodeURIComponent(key)}=; ${cookieOptions}`;
  }
}

/** Defines the shape of a cookie provider. */
export interface CookieProvider {

  /** A getter and setter for the actual values of the cookies. */
  cookie: string;
}
