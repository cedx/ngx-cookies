/* eslint-disable capitalized-comments, line-comment-position */
import {Component, OnInit} from '@angular/core';
import {Cookies, CookieOptions} from '@cedx/ngx-cookies';

/** The factory function creating the default options for the [[Cookies]] service. */
export function optionsFactory(): CookieOptions {
  return new CookieOptions({
    domain: 'www.domain.com',
    path: '/',
    secure: true
  });
}

/** A component that demonstrates the usage of the [[Cookies]] service. */
@Component({
  providers: [
    {provide: CookieOptions, useFactory: optionsFactory}
  ],
  selector: 'my-component',
  templateUrl: './my-component.html'
})
export class MyComponent implements OnInit {
  constructor(private _cookies: Cookies) {}

  ngOnInit(): void {
    // The defaut options used when a cookie is created or removed.
    console.log(JSON.stringify(this._cookies.defaults));
    // {"domain": "www.domain.com", "expires": null, "path": "/", "secure": true}

    // Query the cookies.
    console.log(this._cookies.has('foo')); // false
    console.log(this._cookies.has('baz')); // false
    console.log(this._cookies.length); // 0
    console.log(this._cookies.keys); // []

    // Write the cookies.
    this._cookies.set('foo', 'bar');
    console.log(this._cookies.has('foo')); // true
    console.log(this._cookies.length); // 1
    console.log(this._cookies.keys); // ["foo"]

    this._cookies.setObject('baz', {qux: 123});
    console.log(this._cookies.has('baz')); // true
    console.log(this._cookies.length); // 2
    console.log(this._cookies.keys); // ["foo", "baz"]

    // Read the cookies.
    console.log(this._cookies.get('foo').constructor.name); // "String"
    console.log(this._cookies.get('foo')); // "bar"

    console.log(this._cookies.getObject('baz').constructor.name); // "Object"
    console.log(this._cookies.getObject('baz')); // {qux: 123}
    console.log(this._cookies.getObject('baz').qux); // 123

    // Delete the cookies.
    this._cookies.remove('foo');
    console.log(this._cookies.has('foo')); // false
    console.log(this._cookies.length); // 1
    console.log(this._cookies.keys); // ["baz"]

    this._cookies.clear();
    console.log(this._cookies.has('baz')); // false
    console.log(this._cookies.length); // 0
    console.log(this._cookies.keys); // []
  }
}
