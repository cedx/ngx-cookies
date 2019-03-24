const {expect} = require('chai');
const {CookieOptions} = require('../src');

/**
 * Tests the `CookieOptions` class.
 */
describe('CookieOptions', () => {

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
      const cookieOptions = new CookieOptions({
        domain: 'domain.com',
        expires: 0,
        path: '/path',
        secure: true
      });

      expect(cookieOptions.toJSON()).toEqual({
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
      expect(String(new CookieOptions)).to.be.empty;
    });

    it('should return a format like "expires=<expires>; domain=<domain>; path=<path>; secure" for an initialized instance', () => {
      expect(String(new CookieOptions({domain: 'domain.com', expires: 0, path: '/path', secure: true})))
        .toEqual('expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=domain.com; path=/path; secure');
    });
  });
});
