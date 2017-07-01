/**
 * Defines the attributes of a HTTP cookie.
 */
export class CookieOptions {

  /**
   * Initializes a new instance of the class.
   * @param {Date} [expires] The expiration date and time for the cookie.
   * @param {string} [path] The path to which the cookie applies.
   * @param {string} [domain] The domain for which the cookie is valid.
   * @param {boolean} [secure] Value indicating whether to transmit the cookie over HTTPS only.
   */
  constructor(expires = null, path = '', domain = '', secure = false) {

    /**
     * The domain for which the cookie is valid.
     * @type {string}
     */
    this.domain = domain;

    /**
     * The expiration date and time for the cookie.
     * @type {Date}
     */
    this.expires = expires;

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
   * Converts this object to a map in JSON format.
   * @return {object} The map in JSON format corresponding to this object.
   */
  toJSON() {
    let map = {};
    if (this.domain.length) map.domain = this.domain;
    if (this.expires) map.expires = this.expires.toUTCString();
    if (this.path.length) map.path = this.path;
    if (this.secure) map.secure = this.secure;
    return map;
  }

  /**
   * Returns a string representation of this object.
   * @return {string} The string representation of this object.
   */
  toString() {
    return `${this.constructor.name} ${JSON.stringify(this)}`;
  }
}
