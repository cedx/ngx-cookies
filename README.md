# Cookie Service for Angular
![Runtime](https://img.shields.io/badge/angular-%3E%3D7.2-brightgreen.svg) ![Release](https://img.shields.io/npm/v/@cedx/ngx-cookies.svg) ![License](https://img.shields.io/npm/l/@cedx/ngx-cookies.svg) ![Downloads](https://img.shields.io/npm/dt/@cedx/ngx-cookies.svg) ![Dependencies](https://david-dm.org/cedx/ngx-cookies.js.svg) ![Coverage](https://coveralls.io/repos/github/cedx/ngx-cookies.js/badge.svg) ![Build](https://travis-ci.com/cedx/ngx-cookies.js.svg)

[Angular](https://angular.io) service for interacting with the [HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies), implemented in [TypeScript](https://www.typescriptlang.org).

> This library is packaged as [ECMAScript modules](https://nodejs.org/api/esm.html).

## Installing via [npm](https://www.npmjs.com)
From a command prompt, run:

```shell
$ npm install --save @cedx/ngx-cookies
```

## Usage
This package provides a service dedicated to the cookie management: the `Cookies` class.
It needs to be registered with the dependency injector by importing its module, the `NgxCookies` class:

```javascript
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NgxCookies} from '@cedx/ngx-cookies';
import {AppComponent} from './app_component';

// The root module.
export class AppModule {
  
  // The class decorators.
  static get annotations() {
    return [new NgModule({
      bootstrap: [AppComponent],
      declarations: [AppComponent],
      imports: [BrowserModule, NgxCookies]
    })];
  }
}
```

> The `NgxCookies` provider is intended for the application root module.

Then, it will be available in the constructor of the component classes:

```javascript
import {Component} from '@angular/core';
import {Cookies} from '@cedx/ngx-cookies';

// The main component.
export class AppComponent {
  
  // The class decorators.
  static get annotations() {
    return [new Component({
      selector: 'my-application',
      template: '<h1>Hello World!</h1>'
    })];
  }

  // The constructor parameters.
  static get parameters() {
    return [Cookies];
  }

  // Initializes a new instance of the class.
  constructor(cookies) {
    cookies.get('foo');
    cookies.getObject('bar');

    cookies.set('foo', 'bar');
    cookies.setObject('foo', {bar: 'baz'});
  }
}
```

### Programming interface
The `Cookies` class has the following API:

#### `.defaults: CookieOptions`
Returns the default options to pass when setting cookies:

```javascript
console.log(JSON.stringify(cookies.defaults));
// {"domain": "", "expires": null, "path": "/", "secure": false}

cookies.defaults.domain = 'domain.com';
cookies.defaults.path = '/www';
cookies.defaults.secure = true;

console.log(JSON.stringify(cookies.defaults));
// {"domain": "domain.com", "expires": null, "path": "/www", "secure": true}
```

> This property allows the configuration of the default cookie options at runtime.

#### `.keys: string[]`
Returns the keys of the cookies associated with the current document:

```javascript
console.log(cookies.keys); // []

cookies.set('foo', 'bar');
console.log(cookies.keys); // ["foo"]
```

#### `.length: number`
Returns the number of cookies associated with the current document:

```javascript
console.log(cookies.length); // 0

cookies.set('foo', 'bar');
console.log(cookies.length); // 1
```

#### `.clear()`
Removes all cookies associated with the current document:

```javascript
cookies.set('foo', 'bar');
console.log(cookies.length); // 1

cookies.clear();
console.log(cookies.length); // 0
```

#### `.get(key: string, defaultValue: any = null): string`
Returns the value associated to the specified key:

```javascript
cookies.set('foo', 'bar');
console.log(cookies.get('foo')); // "bar"
```

Returns the `defaultValue` parameter if the key is not found:

```javascript
console.log(cookies.get('unknownKey')); // null
console.log(cookies.get('unknownKey', 'foo')); // "foo"
```

#### `.getObject(key: string, defaultValue: any = null): any`
Deserializes and returns the value associated to the specified key:

```javascript
cookies.setObject('foo', {bar: 'baz'});
console.log(cookies.getObject('foo')); // {bar: "baz"}
```

> The value is deserialized using the [`JSON.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) method.

Returns the `defaultValue` parameter if the key is not found:

```javascript
console.log(cookies.getObject('unknownKey')); // null
console.log(cookies.getObject('unknownKey', false)); // false
```

#### `.has(key: string): boolean`
Returns a boolean value indicating whether the current document has a cookie with the specified key:

```javascript
console.log(cookies.has('foo')); // false

cookies.set('foo', 'bar');
console.log(cookies.has('foo')); // true
```

#### `.remove(key: string, options: CookieOptions = this.defaults)`
Removes the value associated to the specified key:

```javascript
cookies.set('foo', 'bar');
console.log(cookies.has('foo')); // true

cookies.remove('foo');
console.log(cookies.has('foo')); // false
```

#### `.set(key: string, value: string, options: CookieOptions|Date = this.defaults)`
Associates a given value to the specified key:

```javascript
console.log(cookies.get('foo')); // null

cookies.set('foo', 'bar');
console.log(cookies.get('foo')); // "bar"
```

An expiration date and time can be provided for setting the cookie duration:

```javascript
cookies.set('foo', 'bar', new Date(Date.now() + 3600 * 1000));
```

#### `.setObject(key: string, value: any, options: CookieOptions|Date = this.defaults)`
Serializes and associates a given value to the specified key:

```javascript
console.log(cookies.getObject('foo')); // null

cookies.setObject('foo', {bar: 'baz'});
console.log(cookies.getObject('foo')); // {bar: "baz"}
```

> The value is serialized using the [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) method.

An expiration date and time can be provided for setting the cookie duration:

```javascript
cookies.setObject('foo', {bar: 'baz'}, new Date(Date.now() + 3600 * 1000));
```

### Options
Several methods accept an `options` parameter in order to customize the cookie attributes.
These options are expressed using an instance of the [`CookieOptions`](https://github.com/cedx/ngx-cookies.js/blob/master/src/cookie_options.js) class, which has the following properties:

- `domain: string = ""`: The domain for which the cookie is valid.
- `expires: Date = null`: The expiration date and time for the cookie.
- `path: string = ""`: The path to which the cookie applies.
- `secure: boolean = false`: Value indicating whether to transmit the cookie over HTTPS only.

For example:

```javascript
import {CookieOptions} from '@cedx/ngx-cookies';

cookies.set('foo', 'bar', new CookieOptions({
  domain: 'www.domain.com',
  expires: Date.now() + 3600 * 1000, // One hour.
  path: '/'
}));
```

You can provide default values for the cookie options using the `cookieDefaults` injection token:

```javascript
import {APP_BASE_HREF} from '@angular/common';
import {Injector} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NgxCookies, CookieOptions, cookieDefaults} from '@cedx/ngx-cookies';
import {AppComponent} from './app_component';

// The root module.
export class AppModule {
  
  // The class decorators.
  static get annotations() {
    return [new NgModule({
      bootstrap: [AppComponent],
      declarations: [AppComponent],
      imports: [BrowserModule, NgxCookies],
      providers: [{
        provide: cookieDefaults,
        deps: [Injector],
        useFactory: injector => new CookieOptions({
          domain: 'www.domain.com',
          path: injector.get(APP_BASE_HREF, '/'),
          secure: true
        })
      }]
    })];
  }
}
```

> The `Cookies#defaults` property let you override the default cookie options at runtime.

### Iteration
The `Cookies` class is iterable: you can go through all key/value pairs contained using a `for...of` loop. Each entry is an array with two elements (e.g. the key and the value):

```javascript
cookies.set('foo', 'bar');
cookies.set('anotherKey', 'anotherValue');

for (let entry of cookies) {
  console.log(entry);
  // Round 1: ["foo", "bar"]
  // Round 2: ["anotherKey", "anotherValue"] 
}
```

### Events
Every time one or several values are changed (added, removed or updated) through the `Cookies` class, a `changes` event is triggered.

This event is exposed as an [Observable](http://reactivex.io/intro.html), you can subscribe to it using the `onChanges` property:

```javascript
cookies.onChanges.subscribe(changes => {
  for (let change of changes) console.log(change);
});
```

The changes are expressed as an array of [`KeyValueChangeRecord`](https://angular.io/api/core/KeyValueChangeRecord) instances, where a `null` reference indicates an absence of value:

```javascript
cookies.onChanges.subscribe(changes => console.log({
  key: changes[0].key,
  currentValue: changes[0].currentValue,
  previousValue: changes[0].previousValue
}));

cookies.set('foo', 'bar');
// Prints: {key: "foo", currentValue: "bar", previousValue: null}

cookies.set('foo', 'baz');
// Prints: {key: "foo", currentValue: "baz", previousValue: "bar"}

cookies.remove('foo');
// Prints: {key: "foo", currentValue: null, previousValue: "baz"}
```

The values contained in the `currentValue` and `previousValue` properties of the `KeyValueChangeRecord` instances are the raw cookie values. If you use the `Cookies#setObject()` method to set a cookie, you will get the serialized string value, not the original value passed to the method:

```javascript
cookies.setObject('foo', {bar: 'baz'});
// Prints: {key: "foo", currentValue: "{\"bar\": \"baz\"}", previousValue: null}
```

## See also
- [API reference](https://dev.belin.io/ngx-cookies.js/api)
- [Code coverage](https://coveralls.io/github/cedx/ngx-cookies.js)
- [Continuous integration](https://travis-ci.com/cedx/ngx-cookies.js)

## License
[Cookie Service for Angular](https://dev.belin.io/ngx-cookies.js) is distributed under the MIT License.
