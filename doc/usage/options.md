---
path: src/branch/master
source: src/options.ts
---

# Cookie options
Several methods of the [Cookies](api.md) class accept an `options` parameter in order to customize the cookie attributes.
These options are expressed using an instance of the `CookieOptions` class, which has the following properties:

- **domain**: `string`: The domain for which the cookie is valid.
- **expires**: `Date`: The expiration date and time for the cookie. An `undefined` value indicates a session cookie.
- **maxAge**: `number`: The maximum duration, in seconds, until the cookie expires. A negative value indicates a session cookie.
- **path**: `string`: The path to which the cookie applies.
- **secure**: `boolean`: Value indicating whether to transmit the cookie over HTTPS only.

!!! info
    The `maxAge` property has precedence over the `expires` one.

For example:

```typescript
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
      maxAge: 3600, // One hour.
      path: '/'
   }));
  }
}
```
    
## Configuring defaults
It is possible to provide default values for the cookie options by using the [`Cookies.defaults`](api.md) property:

```typescript
import {Component, OnInit} from '@angular/core';
import {Cookies} from '@cedx/cookies';

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
