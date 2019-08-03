import {CookieOptions, Cookies} from '../src/index';

/** Tests the [[Cookies]] class. */
describe('Cookies', () => {
  describe('#keys', () => {
    it('should return an empty array if the current document has no associated cookie', () => {
      expect(new Cookies(new CookieOptions, document).keys.length).toEqual(0);
    });

    it('should return the keys of the cookies associated with the current document', () => {
      const {document} = (new JSDOM).window;
      document.cookie = 'foo=bar';
      document.cookie = 'bar=baz';

      const keys = new Cookies(new CookieOptions, document).keys;
      expect(keys.length).toEqual(2);
      expect(keys[0]).toEqual('foo');
      expect(keys[1]).toEqual('bar');
    });
  });

  describe('#length', () => {
    it('should return zero if the current document has no associated cookie', () => {
      const {document} = (new JSDOM).window;
      expect(new Cookies(new CookieOptions, document).length).toEqual(0);
    });

    it('should return the number of cookies associated with the current document', () => {
      const {document} = (new JSDOM).window;
      document.cookie = 'foo=bar';
      document.cookie = 'bar=baz';
      expect(new Cookies(new CookieOptions, document).length).toEqual(2);
    });
  });

  describe('#onChanges', () => {
    it('should trigger an event when a cookie is added', done => {
      const {document} = (new JSDOM).window;
      const cookies = new Cookies(new CookieOptions, document);

      const subscription = cookies.onChanges.subscribe(changes => {
        expect(changes).toBe('array').and.have.lengthOf(1);

        const record = changes[0];
        expect(record).toBe('object');
        expect(record.key).toEqual('foo');
        expect(record.currentValue).toEqual('bar');
        expect(record.previousValue).toBeNull();

        done();
      }, done);

      cookies.set('foo', 'bar');
      subscription.unsubscribe();
    });

    it('should trigger an event when a cookie is updated', done => {
      const {document} = (new JSDOM).window;
      document.cookie = 'foo=bar';

      const cookies = new Cookies(new CookieOptions, document);
      const subscription = cookies.onChanges.subscribe(changes => {
        expect(changes).toBe('array').and.have.lengthOf(1);

        const record = changes[0];
        expect(record).toBe('object');
        expect(record.key).toEqual('foo');
        expect(record.currentValue).toEqual('baz');
        expect(record.previousValue).toEqual('bar');

        done();
      }, done);

      cookies.set('foo', 'baz');
      subscription.unsubscribe();
    });

    it('should trigger an event when a cookie is removed', done => {
      const {document} = (new JSDOM).window;
      document.cookie = 'foo=bar';

      const cookies = new Cookies(new CookieOptions, document);
      const subscription = cookies.onChanges.subscribe(changes => {
        expect(changes).toBe('array').and.have.lengthOf(1);

        const record = changes[0];
        expect(record).toBe('object');
        expect(record.key).toEqual('foo');
        expect(record.currentValue).toBeNull();
        expect(record.previousValue).toEqual('bar');

        done();
      }, done);

      cookies.remove('foo');
      subscription.unsubscribe();
    });

    it('should trigger an event when all the cookies are removed', done => {
      const {document} = (new JSDOM).window;
      document.cookie = 'foo=bar';
      document.cookie = 'bar=baz';

      const cookies = new Cookies(new CookieOptions, document);
      const subscription = cookies.onChanges.subscribe(changes => {
        expect(changes).toBe('array').and.have.lengthOf(2);

        let record = changes[0];
        expect(record).toBe('object');
        expect(record.key).toEqual('foo');
        expect(record.currentValue).toBeNull();
        expect(record.previousValue).toEqual('bar');

        record = changes[1];
        expect(record).toBe('object');
        expect(record.key).toEqual('bar');
        expect(record.currentValue).toBeNull();
        expect(record.previousValue).toEqual('baz');

        done();
      }, done);

      cookies.clear();
      subscription.unsubscribe();
    });
  });

  describe('#[Symbol.iterator]()', () => {
    it('should return a done iterator if the current document has no associated cookie', () => {
      const cookies = new Cookies(new CookieOptions, (new JSDOM).window.document);
      const iterator = cookies[Symbol.iterator]();
      expect(iterator.next().done).toBe(true);
    });

    it('should return a value iterator if the current document has associated cookies', () => {
      const {document} = (new JSDOM).window;
      document.cookie = 'foo=bar';
      document.cookie = 'bar=baz';

      const cookies = new Cookies(new CookieOptions, document);
      const iterator = cookies[Symbol.iterator]();

      let next = iterator.next();
      expect(next.done).toBe(false);
      expect(next.value).toBe('array');
      expect(next.value[0]).toEqual('foo');
      expect(next.value[1]).toEqual('bar');

      next = iterator.next();
      expect(next.done).toBe(false);
      expect(next.value[0]).toEqual('bar');
      expect(next.value[1]).toEqual('baz');
      expect(iterator.next().done).toBe(true);
    });
  });

  describe('#clear()', () => {
    it('should remove all the cookies associated with the current document', () => {
      const {document} = (new JSDOM).window;
      document.cookie = 'foo=bar';
      document.cookie = 'bar=baz';

      const cookies = new Cookies(new CookieOptions, document);
      cookies.clear();
      expect(document.cookie).not.toContain('foo');
      expect(document.cookie).not.toContain('bar');
    });
  });

  describe('#get()', () => {
    it('should properly get the cookies associated with the current document', () => {
      const {document} = (new JSDOM).window;
      const cookies = new Cookies(new CookieOptions, document);

      expect(cookies.get('foo')).toBeNull();
      expect(cookies.get('foo', '123')).toEqual('123');

      document.cookie = 'foo=bar';
      expect(cookies.get('foo')).toEqual('bar');

      document.cookie = 'foo=123';
      expect(cookies.get('foo')).toEqual('123');
    });
  });

  describe('#getObject()', () => {
    it('should properly get the deserialized cookies associated with the current document', () => {
      const {document} = (new JSDOM).window;
      const cookies = new Cookies(new CookieOptions, document);

      expect(cookies.getObject('foo')).toBeNull();
      expect(cookies.getObject('foo', {key: 'value'})).toEqual({key: 'value'});

      document.cookie = 'foo=123';
      expect(cookies.getObject('foo')).toEqual(123);

      document.cookie = 'foo=%22bar%22';
      expect(cookies.getObject('foo')).toEqual('bar');

      document.cookie = 'foo=%7B%22key%22%3A%22value%22%7D';
      expect(cookies.getObject('foo')).toBe('object')
        .and.have.property('key).toEqual('value');
    });

    it('should return the default value if the value can\'t be deserialized', () => {
      const {document} = (new JSDOM).window;
      document.cookie = 'foo=bar';

      const cookies = new Cookies(new CookieOptions, document);
      expect(cookies.getObject('foo', 'defaultValue')).toEqual('defaultValue');
    });
  });

  describe('#has()', () => {
    it('should return `false` if the current document has an associated cookie with the specified key', () => {
      const {document} = (new JSDOM).window;
      expect(new Cookies(new CookieOptions, document).has('foo')).toBe(false);
    });

    it('should return `true` if the current document does not have an associated cookie with the specified key', () => {
      const {document} = (new JSDOM).window;
      document.cookie = 'foo=bar';

      const cookies = new Cookies(new CookieOptions, document);
      expect(cookies.has('foo')).toBe(true);
      expect(cookies.has('bar')).toBe(false);
    });
  });

  describe('#remove()', () => {
    it('should properly remove the cookies associated with the current document', () => {
      const {document} = (new JSDOM).window;
      document.cookie = 'foo=bar';
      document.cookie = 'bar=baz';

      const cookies = new Cookies(new CookieOptions, document);
      cookies.remove('foo');
      expect(document.cookie).not.toContain('foo');
      expect(document.cookie).toContain('bar=baz');

      cookies.remove('bar');
      expect(document.cookie).not.toContain('bar');
    });
  });

  describe('#set()', () => {
    it('should properly set the cookies associated with the current document', () => {
      const {document} = (new JSDOM).window;
      const cookies = new Cookies(new CookieOptions, document);
      expect(document.cookie).not.toContain('foo');

      cookies.set('foo', 'bar');
      expect(document.cookie).toContain('foo=bar');

      cookies.set('foo', '123');
      expect(document.cookie).toContain('foo=123');
    });

    it('should throw an error if the specified key is a reserved word', () => {
      const {document} = (new JSDOM).window;
      const cookies = new Cookies(new CookieOptions, document);
      expect(() => cookies.set('domain', 'foo')).to.throw(TypeError);
      expect(() => cookies.set('expires', 'foo')).to.throw(TypeError);
      expect(() => cookies.set('max-age', 'foo')).to.throw(TypeError);
      expect(() => cookies.set('path', 'foo')).to.throw(TypeError);
      expect(() => cookies.set('secure', 'foo')).to.throw(TypeError);
    });
  });

  describe('#setObject()', () => {
    it('should properly serialize and set the cookies associated with the current document', () => {
      const {document} = (new JSDOM).window;
      const cookies = new Cookies(new CookieOptions, document);
      expect(document.cookie).not.toContain('foo');

      cookies.setObject('foo', 123);
      expect(document.cookie).toContain('foo=123');

      cookies.setObject('foo', 'bar');
      expect(document.cookie).toContain('foo=%22bar%22');

      cookies.setObject('foo', {key: 'value'});
      expect(document.cookie).toContain('foo=%7B%22key%22%3A%22value%22%7D');
    });

    it('should throw an error if the specified key is a reserved word', () => {
      const {document} = (new JSDOM).window;
      const cookies = new Cookies(new CookieOptions, document);
      expect(() => cookies.setObject('domain', 'foo')).to.throw(TypeError);
      expect(() => cookies.setObject('expires', 'foo')).to.throw(TypeError);
      expect(() => cookies.setObject('max-age', 'foo')).to.throw(TypeError);
      expect(() => cookies.setObject('path', 'foo')).to.throw(TypeError);
      expect(() => cookies.setObject('secure', 'foo')).to.throw(TypeError);
    });
  });

  describe('#toString()', () => {
    it('should return an empty string for a newly created instance', () => {
      const {document} = (new JSDOM).window;
      expect(String(new Cookies(new CookieOptions, document)).length).toEqual(0);
    });

    it('should return a format like "<key>=<value>(; <key>=<value>)*" for an initialized instance', () => {
      const {document} = new JSDOM('', {url: 'https://domain.com/path'}).window;
      const cookies = new Cookies(new CookieOptions({domain: 'domain.com', path: '/path', secure: true}), document);

      cookies.set('foo', 'bar');
      expect(String(cookies)).toEqual('foo=bar');

      cookies.set('bar', 'baz', new Date(Date.now() + 3600000));
      expect(String(cookies)).toEqual('foo=bar; bar=baz');
    });
  });
});
