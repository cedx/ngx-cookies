path: blob/master
source: src/cookies.ts

# Programming interface
This package provides a service dedicated to the cookie management: the `Cookies` class.

```ts
import {Component, OnInit} from '@angular/core';
import {Cookies} from '@cedx/ngx-cookies';

@Component({
  selector: 'my-component',
  templateUrl: './my-component.html'
})
export class MyComponent implements OnInit {
  constructor(private _cookies: Cookies) {}
  
  ngOnInit(): void {
    this._cookies.set('foo', 'bar');
    console.log(this._cookies.get('foo')); // "bar"

    this._cookies.setObject('foo', {baz: 'qux'});
    console.log(this._cookies.getObject('foo')); // {baz: "qux"}
  }
}
```

The `Cookies` class has the following API:

## **#defaults**: CookieOptions
Returns the default [options](options.md) to pass when setting cookies:

```ts
import {Component, OnInit} from '@angular/core';
import {Cookies} from '@cedx/ngx-cookies';

@Component({
  selector: 'my-component',
  templateUrl: './my-component.html'
})
export class MyComponent implements OnInit {
  constructor(private _cookies: Cookies) {}
  
  ngOnInit(): void {
    console.log(JSON.stringify(this._cookies.defaults));
    // {"domain": "", "expires": null, "path": "", "secure": false}

    this._cookies.defaults.domain = 'domain.com';
    this._cookies.defaults.path = '/www';
    this._cookies.defaults.secure = true;

    console.log(JSON.stringify(this._cookies.defaults));
    // {"domain": "domain.com", "expires": null, "path": "/www", "secure": true}
  }
}
```

## **#keys**: string[]
Returns the keys of the cookies associated with the current document:

```ts
import {Component, OnInit} from '@angular/core';
import {Cookies} from '@cedx/ngx-cookies';

@Component({
  selector: 'my-component',
  templateUrl: './my-component.html'
})
export class MyComponent implements OnInit {
  constructor(private _cookies: Cookies) {}
  
  ngOnInit(): void {
    console.log(this._cookies.keys); // []

    this._cookies.set('foo', 'bar');
    console.log(this._cookies.keys); // ["foo"]
  }
}
```

## **#length**: number
Returns the number of cookies associated with the current document:

```ts
import {Component, OnInit} from '@angular/core';
import {Cookies} from '@cedx/ngx-cookies';

@Component({
  selector: 'my-component',
  templateUrl: './my-component.html'
})
export class MyComponent implements OnInit {
  constructor(private _cookies: Cookies) {}
  
  ngOnInit(): void {
    console.log(this._cookies.length); // 0

    this._cookies.set('foo', 'bar');
    console.log(this._cookies.length); // 1
  }
}
```

## **#clear**(): void
Removes all cookies associated with the current document:

```ts
import {Component, OnInit} from '@angular/core';
import {Cookies} from '@cedx/ngx-cookies';

@Component({
  selector: 'my-component',
  templateUrl: './my-component.html'
})
export class MyComponent implements OnInit {
  constructor(private _cookies: Cookies) {}
  
  ngOnInit(): void {
    this._cookies.set('foo', 'bar');
    console.log(this._cookies.length); // 1

    this._cookies.clear();
    console.log(this._cookies.length); // 0
  }
}
```

## **#get**(key: string, defaultValue?: string): string|undefined
Returns the value associated to the specified key:

```ts
import {Component, OnInit} from '@angular/core';
import {Cookies} from '@cedx/ngx-cookies';

@Component({
  selector: 'my-component',
  templateUrl: './my-component.html'
})
export class MyComponent implements OnInit {
  constructor(private _cookies: Cookies) {}
  
  ngOnInit(): void {
    console.log(this._cookies.get('foo')); // undefined
    console.log(this._cookies.get('foo', 'qux')); // "qux"

    this._cookies.set('foo', 'bar');
    console.log(this._cookies.get('foo')); // "bar"
  }
}
```

Returns `undefined` or the given default value if the key is not found.

## **#getObject**(key: string, defaultValue?: any): any
Deserializes and returns the value associated to the specified key:

```ts
import {Component, OnInit} from '@angular/core';
import {Cookies} from '@cedx/ngx-cookies';

@Component({
  selector: 'my-component',
  templateUrl: './my-component.html'
})
export class MyComponent implements OnInit {
  constructor(private _cookies: Cookies) {}
  
  ngOnInit(): void {
    console.log(this._cookies.getObject('foo')); // undefined
    console.log(this._cookies.getObject('foo', 'qux')); // "qux"
  
    this._cookies.setObject('foo', {bar: 'baz'});
    console.log(this._cookies.getObject('foo')); // {bar: "baz"}
  }
}
```

!!! info
    The value is deserialized using the [`JSON.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) method.

Returns `undefined` or the given default value if the key is not found.

## **#has**(key: string): boolean
Returns a boolean value indicating whether the current document has a cookie with the specified key:

```ts
import {Component, OnInit} from '@angular/core';
import {Cookies} from '@cedx/ngx-cookies';

@Component({
  selector: 'my-component',
  templateUrl: './my-component.html'
})
export class MyComponent implements OnInit {
  constructor(private _cookies: Cookies) {}
  
  ngOnInit(): void {
    console.log(this._cookies.has('foo')); // false

    this._cookies.set('foo', 'bar');
    console.log(this._cookies.has('foo')); // true
  }
}
```

## **#remove**(key: string, options?: CookieOptions): string
Removes the value associated to the specified key:

```ts
import {Component, OnInit} from '@angular/core';
import {Cookies} from '@cedx/ngx-cookies';

@Component({
  selector: 'my-component',
  templateUrl: './my-component.html'
})
export class MyComponent implements OnInit {
  constructor(private _cookies: Cookies) {}
  
  ngOnInit(): void {
    this._cookies.set('foo', 'bar');
    console.log(this._cookies.has('foo')); // true

    console.log(this._cookies.remove('foo')); // "bar"
    console.log(this._cookies.has('foo')); // false
  }
}
```

## **#set**(key: string, value: string, options?: CookieOptions): this
Associates a given value to the specified key:

```ts
import {Component, OnInit} from '@angular/core';
import {Cookies} from '@cedx/ngx-cookies';

@Component({
  selector: 'my-component',
  templateUrl: './my-component.html'
})
export class MyComponent implements OnInit {
  constructor(private _cookies: Cookies) {}
  
  ngOnInit(): void {
    console.log(this._cookies.get('foo')); // undefined

    this._cookies.set('foo', 'bar');
    console.log(this._cookies.get('foo')); // "bar"
  }
}
```

## **#setObject**(key: string, value: any, options?: CookieOptions): this
Serializes and associates a given value to the specified key:

```ts
import {Component, OnInit} from '@angular/core';
import {Cookies} from '@cedx/ngx-cookies';

@Component({
  selector: 'my-component',
  templateUrl: './my-component.html'
})
export class MyComponent implements OnInit {
  constructor(private _cookies: Cookies) {}
  
  ngOnInit(): void {
    console.log(this._cookies.getObject('foo')); // undefined

    this._cookies.setObject('foo', {bar: 'baz'});
    console.log(this._cookies.getObject('foo')); // {bar: "baz"}
  }
}
```

!!! info
    The value is serialized using the [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) method.
