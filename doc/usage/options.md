path: blob/master
source: src/cookie_options.ts

# Cookie options
Several methods of the [Cookies](api.md) class accept an `options` parameter in order to customize the cookie attributes.
These options are expressed using an instance of the [`CookieOptions`](https://github.com/cedx/cookies.js/blob/master/src/cookie_options.ts) class, which has the following properties:

- **domain**: string = `""`: The domain for which the cookie is valid.
- **expires**: Date|null = `null`: The expiration date and time for the cookie.
- **path**: string = `""`: The path to which the cookie applies.
- **secure**: boolean = `false`: Value indicating whether to transmit the cookie over HTTPS only.

For example:

```ts
import {Component, OnInit} from '@angular/core';
import {Cookies, CookieOptions} from '@cedx/cookies';

@Component({
  selector: 'my-component',
  templateUrl: './my-component.html'
})
export class MyComponent implements OnInit {
  constructor(private _cookies: Cookies) {}
  
  ngOnInit(): void {
    this._cookies.set('foo', 'bar', new CookieOptions({
      domain: 'www.domain.com',
      expires: new Date(Date.now() + (3600 * 1000)), // One hour.
      path: '/'
   }));
  }
}
```

For convenience, you can also use a literal object instead of a `CookieOptions` instance:

```ts
import {Component, OnInit} from '@angular/core';
import {Cookies} from '@cedx/cookies';

@Component({
  selector: 'my-component',
  templateUrl: './my-component.html'
})
export class MyComponent implements OnInit {
  constructor(private _cookies: Cookies) {}
  
  ngOnInit(): void {
    this._cookies.set('foo', 'bar', {
      domain: 'www.domain.com',
      expires: new Date(Date.now() + (3600 * 1000)), // One hour.
      path: '/'
    });
  }
}
```

It is possible to provide default values for the cookie options when instantiating the `Cookies` service through dependency injection:

```ts
import {Component, OnInit} from '@angular/core';
import {Cookies, CookieOptions} from '@cedx/cookies';

@Component({
  providers: [
    {provide: CookieOptions, useValue: new CookieOptions({
      domain: 'www.domain.com',
      path: '/',
      secure: true
    })}
  ],
  selector: 'my-component',
  templateUrl: './my-component.html'
})
export class MyComponent implements OnInit {
  constructor(private _cookies: Cookies) {}
  
  ngOnInit(): void {
    console.log(JSON.stringify(this._cookies.defaults));
    // {"domain": "www.domain.com", "expires": null, "path": "/", "secure": true}
  }
}
```

!!! tip
    The [`Cookies#defaults`](api.md) property let you override the default cookie options at runtime.
