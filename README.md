# Cookie service for Angular
![Runtime](https://img.shields.io/badge/angular-%3E%3D4.2.5-brightgreen.svg) ![Release](https://img.shields.io/npm/v/@cedx/ngx-cookies.svg) ![License](https://img.shields.io/npm/l/@cedx/ngx-cookies.svg) ![Downloads](https://img.shields.io/npm/dt/@cedx/ngx-cookies.svg) ![Dependencies](https://david-dm.org/cedx/ngx-cookies.svg) ![Coverage](https://coveralls.io/repos/github/cedx/ngx-cookies/badge.svg) ![Build](https://travis-ci.org/cedx/ngx-cookies.svg)

[Angular](https://angular.io) service for interacting with the [HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies), implemented in [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript).

## Installing via [npm](https://www.npmjs.com)
From a command prompt, run:

```shell
$ npm install --save @cedx/ngx-cookies
```

## Usage
This package delivers two providers dedicated to the cookie management: the `Cookies` service and the `COOKIE_OPTIONS` injection token.

They need to be registered with the dependency injector by importing their module, the `CookieModule` class:

```javascript
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {CookieModule} from '@cedx/ngx-cookies';
import {AppComponent} from './app_component';

// The root module.
export class AppModule {
  
  // The class decorators.
  static get annotations() {
    return [new NgModule({
      bootstrap: [AppComponent],
      declarations: [AppComponent],
      imports: [BrowserModule, CookieModule]
    })];
  }
}
```

> The `Cookies` and `COOKIE_OPTIONS` providers are intended for the application root module only.

Then, they will be available in the constructor of the component classes:

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
  constructor(cookieService) {
    cookieService.get('foo');
    cookieService.getObject('bar');

    cookieService.set('foo', 'bar');
    cookieService.setObject('foo', {bar: 'baz'});
  }
}
```

### Programming interface
The `Cookies` class has the following API:

#### `.keys: string[]`
Returns the names of all the cookies:

```javascript
console.log(cookieService.keys); // []

cookieService.set('foo', 'bar');
console.log(cookieService.keys); // ["foo"]
```

#### `.length: number`
Returns the number of entries in the associated storage:

```javascript
console.log(cookieService.length); // 0

cookieService.set('foo', 'bar');
console.log(cookieService.length); // 1
```

#### `.clear()`
Removes all entries from the associated storage:

```javascript
cookieService.set('foo', 'bar');
console.log(cookieService.length); // 1

cookieService.clear();
console.log(cookieService.length); // 0
```

#### `.get(key: string, defaultValue: any = null): string`
Returns the value associated to the specified key:

```javascript
cookieService.set('foo', 'bar');
console.log(cookieService.get('foo')); // "bar"
```

Returns the `defaultValue` parameter if the key is not found:

```javascript
console.log(cookieService.get('unknownKey')); // null
console.log(cookieService.get('unknownKey', 'foo')); // "foo"
```

#### `.getObject(key: string, defaultValue: any = null): any`
Deserializes and returns the value associated to the specified key:

```javascript
cookieService.setObject('foo', {bar: 'baz'});
console.log(cookieService.getObject('foo')); // {bar: "baz"}
```

> The value is deserialized using the [`JSON.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) method.

Returns the `defaultValue` parameter if the key is not found:

```javascript
console.log(cookieService.getObject('unknownKey')); // null
console.log(cookieService.getObject('unknownKey', false)); // false
```

#### `.has(key: string): boolean`
Returns a boolean value indicating whether the associated storage contains the specified key:

```javascript
console.log(cookieService.has('foo')); // false

cookieService.set('foo', 'bar');
console.log(cookieService.has('foo')); // true
```

#### `.remove(key: string)`
Removes the value associated to the specified key:

```javascript
cookieService.set('foo', 'bar');
console.log(cookieService.has('foo')); // true

cookieService.remove('foo');
console.log(cookieService.has('foo')); // false
```

#### `.set(key: string, value: string)`
Associates a given value to the specified key:

```javascript
console.log(cookieService.get('foo')); // null

cookieService.set('foo', 'bar');
console.log(cookieService.get('foo')); // "bar"
```

#### `.setObject(key: string, value: any)`
Serializes and associates a given value to the specified key:

```javascript
console.log(cookieService.getObject('foo')); // null

cookieService.setObject('foo', {bar: 'baz'});
console.log(cookieService.getObject('foo')); // {bar: "baz"}
```

> The value is serialized using the [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) method.

### Iteration
The `Cookies` class is iterable: you can go through all key/value pairs contained using a `for...of` loop. Each entry is an array with two elements (e.g. the key and the value):

```javascript
cookieService.set('foo', 'bar');
cookieService.set('anotherKey', 'anotherValue');

for (let entry of cookieService) {
  console.log(entry);
  // Round 1: ["foo", "bar"]
  // Round 2: ["anotherKey", "anotherValue"] 
}
```

### Events
Every time one or several values are changed (added, removed or updated) through the `Cookies` class, a `changes` event is triggered.

This event is exposed as an [Observable](http://reactivex.io/intro.html), you can subscribe to it using the `onChanges` property:

```javascript
cookieService.onChanges.subscribe(
  changes => console.log(changes)
);
```

The changes are expressed as an array of [`KeyValueChangeRecord`](https://angular.io/docs/js/latest/api/core/index/KeyValueChangeRecord-interface.html) instances, where a `null` reference indicates an absence of value:

```javascript
cookieService.onChanges.subscribe(changes => console.log(changes[0]));

cookieService.set('foo', 'bar');
// Prints: {key: "foo", currentValue: "bar", previousValue: null}

cookieService.set('foo', 'baz');
// Prints: {key: "foo", currentValue: "baz", previousValue: "bar"}

cookieService.remove('foo');
// Prints: {key: "foo", currentValue: null, previousValue: "baz"}
```

The values contained in the `currentValue` and `previousValue` properties of the `KeyValueChangeRecord` instances are the raw storage values. If you use the `Cookies#setObject` method to change a key, you will get the serialized string value, not the original value passed to the method:

```javascript
cookieService.setObject('foo', {bar: 'baz'});
// Prints: {key: "foo", currentValue: "{\"bar\": \"baz\"}", previousValue: null}
```

## See also
- [API reference](https://cedx.github.io/ngx-cookies)
- [Code coverage](https://coveralls.io/github/cedx/ngx-cookies)
- [Continuous integration](https://travis-ci.org/cedx/ngx-cookies)

## License
[Cookie service for Angular](https://github.com/cedx/ngx-cookies) is distributed under the Apache License, version 2.0.
