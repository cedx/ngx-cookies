import {CookieOptions} from '../src/index';

/** Tests the [[CookieOptions]] class. */
describe('CookieOptions', () => {
  const options = new CookieOptions({
    domain: 'domain.com',
    expires: new Date(0),
    path: '/path',
    secure: true
  });

  describe('#maxAge', () => {
    it('should return `-1` if the expiration time is not set', () => {
      expect(new CookieOptions().maxAge).toEqual(-1);
    });

    it('should return zero if the cookie has expired', () => {
      expect(new CookieOptions({expires: new Date(2000, 0)}).maxAge).toEqual(0);
    });

    it('should return the difference with now if the cookie has not expired', () => {
      const duration = 30 * 1000;
      expect(new CookieOptions({expires: new Date(Date.now() + duration)}).maxAge).toEqual(30);
    });

    it('should set the expiration date accordingly', () => {
      const cookieOptions = new CookieOptions;

      cookieOptions.maxAge = 0;
      const now = Date.now();
      let time = cookieOptions.expires!.getTime();
      expect(time).toBeGreaterThan(now - 1000);
      expect(time).toBeLessThanOrEqual(now);

      cookieOptions.maxAge = 30;
      const later = Date.now() + (30 * 1000);
      time = cookieOptions.expires!.getTime();
      expect(time).toBeGreaterThan(later - 1000);
      expect(time).toBeLessThanOrEqual(later);

      cookieOptions.maxAge = -1;
      expect(cookieOptions.expires).toBeUndefined();
    });
  });

  describe('.fromJson()', () => {
    it('should return an instance with default values for an empty map', () => {
      const cookieOptions = CookieOptions.fromJson({});
      expect(cookieOptions.domain.length).toEqual(0);
      expect(cookieOptions.expires).toBeUndefined();
      expect(cookieOptions.maxAge).toEqual(-1);
      expect(cookieOptions.path.length).toEqual(0);
      expect(cookieOptions.secure).toBe(false);
    });

    it('should return an initialized instance for a non-empty map', () => {
      const cookieOptions = CookieOptions.fromJson(options.toJSON());
      expect(cookieOptions.domain).toEqual('domain.com');
      expect(cookieOptions.expires!.toISOString()).toEqual('1970-01-01T00:00:00.000Z');
      expect(cookieOptions.maxAge).toEqual(0);
      expect(cookieOptions.path).toEqual('/path');
      expect(cookieOptions.secure).toBe(true);
    });
  });

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
      expect(options.toJSON()).toEqual({
        domain: 'domain.com',
        expires: '1970-01-01T00:00:00.000Z',
        path: '/path',
        secure: true
      });
    });
  });

  describe('#toString()', () => {
    it('should return an empty string for a newly created instance', () => {
      expect(String(new CookieOptions).length).toEqual(0);
    });

    it('should return a format like "expires=<expires>; domain=<domain>; path=<path>; secure" for an initialized instance', () => {
      expect(String(options)).toEqual('expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=domain.com; path=/path; secure');
    });
  });
});
