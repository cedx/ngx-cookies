import {CookieOptions} from './options';

/** Defines the shape of a cookie provider. */
export interface CookieProvider {

  /** A getter and setter for the actual values of the cookies. */
  cookie: string;
}

/** A cookie provider based on a [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map). */
export class MapProvider implements CookieProvider {

  /** The underlying data store. */
  private _map: Map<string, [string, CookieOptions]> = new Map<string, [string, CookieOptions]>();

  /** A getter for the actual values of the cookies. */
  get cookie(): string {
    return [...this._map.entries()]
      .filter(([, value]) => value[1].expires ? value[1].expires.getTime() < Date.now() : true)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value[0])}`).join('; ');
  }

  /** A setter for the actual values of the cookies. */
  set cookie(value: string) {
    const [cookieName, cookieValue] = value.replace(/^([^;]+)/, '$1').split('=');
    this._map.set(cookieName, [cookieValue, CookieOptions.fromString(value)]);
  }
}
