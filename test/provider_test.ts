import {MapProvider} from '../src/index';

/** Tests the [[MapProvider]] class. */
describe('MapProvider', () => {
  describe('#cookie', () => {
    it('should return an empty string if there is no cookie', () => {
      expect(new MapProvider().cookie.length).toEqual(0);
    });

    it('should return an empty string if the cookie has expired', () => {
      const provider = new MapProvider;
      provider.cookie = 'foo=bar; max-age=0';
      expect(provider.cookie.length).toEqual(0);
    });

    it('should return a format like "<name>=<value>" if the cookie has not expired', () => {
      const provider = new MapProvider;
      provider.cookie = 'foo=bar; max-age=30';
      expect(provider.cookie).toEqual('foo=bar');
    });

    it('should handle multiple cookies', () => {
      const provider = new MapProvider;
      provider.cookie = 'foo=bar';
      expect(provider.cookie).toEqual('foo=bar');
      provider.cookie = 'baz=qux';
      expect(provider.cookie).toEqual('foo=bar; baz=qux');
      provider.cookie = 'foo=; max-age=0';
      expect(provider.cookie).toEqual('baz=qux');
    });
  });
});
