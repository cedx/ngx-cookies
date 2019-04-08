import {CookieOptions} from '../src';

/**
 * Tests the `CookieOptions` class.
 */
describe('CookieOptions', () => {
  const options = new CookieOptions({
    domain: 'domain.com',
    expires: new Date(0),
    path: '/path',
    secure: true
  });

  /**
   * Tests the `CookieOptions.fromJson()` method.
   */
  describe('.fromJson()', () => {
    it('should return an instance with default values for an empty map', () => {
      const cookieOptions = CookieOptions.fromJson({});
      expect(cookieOptions.domain.length).toEqual(0);
      expect(cookieOptions.expires).toBeNull();
      expect(cookieOptions.path.length).toEqual(0);
      expect(cookieOptions.secure).toBeFalsy();
    });

    it('should return an initialized instance for a non-empty map', () => {
      const cookieOptions = CookieOptions.fromJson(options.toJSON());
      expect(cookieOptions.domain).toEqual(options.domain);
      expect(cookieOptions.expires!.getTime()).toEqual(options.expires!.getTime());
      expect(cookieOptions.path).toEqual(options.path);
      expect(cookieOptions.secure).toEqual(options.secure);
    });
  });

  /**
   * Tests the `CookieOptions#toJSON()` method.
   */
  describe('#toJSON()', () => {
    it('should return a map with default values for a newly created instance', () => {
      expect(new CookieOptions().toJSON()).toEqual({
        domain: '',
        expires: null,
        path: '',
        secure: false
      });
    });

    it('should return a non-empty map for an initialized instance', () => {
      expect(new CookieOptions(options).toJSON()).toEqual({
        domain: 'domain.com',
        expires: '1970-01-01T00:00:00.000Z',
        path: '/path',
        secure: true
      });
    });
  });

  /**
   * Tests the `CookieOptions#toString()` method.
   */
  describe('#toString()', () => {
    it('should return an empty string for a newly created instance', () => {
      expect(String(new CookieOptions).length).toEqual(0);
    });

    it('should return a format like "expires=<expires>; domain=<domain>; path=<path>; secure" for an initialized instance', () => {
      expect(String(new CookieOptions(options)))
        .toEqual('expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=domain.com; path=/path; secure');
    });
  });
});
