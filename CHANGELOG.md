# Changelog

## Version [2.0.0](https://github.com/cedx/ngx-cookies.js/compare/v1.3.0...v2.0.0)
- Breaking change: changed the signature of the `CookieOptions` class constructor.
- Breaking change: dropped the [CommonJS modules](https://nodejs.org/api/modules.html) in favor of [ECMAScript](https://nodejs.org/api/esm.html) ones.
- Breaking change: ported the source code to [TypeScript](https://www.typescriptlang.org).
- Breaking change: raised the required [Node.js](https://nodejs.org) version.
- Breaking change: renamed the `CookieModule` module to `NgxCookies`.
- Added the `CookieOptions.fromJson()` method.
- Added the `Cookies.toJSON()` method.
- Added a user guide based on [MkDocs](http://www.mkdocs.org).
- Replaced [ESDoc](https://esdoc.org) documentation generator by [TypeDoc](https://typedoc.org).
- Replaced [ESLint](https://eslint.org) static analyzer by [TSLint](https://palantir.github.io/tslint).
- Removed the dependency on [Babel](https://babeljs.io) compiler.
- Updated the build system to [Gulp](https://gulpjs.com) version 4.
- Updated the package dependencies.

## Version [1.3.0](https://github.com/cedx/ngx-cookies.js/compare/v1.2.0...v1.3.0)
- Changed licensing for the [MIT License](https://opensource.org/licenses/MIT).
- Replaced the `ec.cookie-mock` module by `jsdom` for testing.
- Updated the package dependencies.

## Version [1.2.0](https://github.com/cedx/ngx-cookies.js/compare/v1.1.0...v1.2.0)
- Added support for [Browserslist](http://browserl.ist) shared settings.
- Added the [`#[Symbol.toStringTag]`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toStringTag) property to the `Cookies` and `CookieOptions` classes.
- Moved the [Angular](https://angular.io) and [RxJS](http://reactivex.io/rxjs) dependencies to peer ones.
- Updated the package dependencies.

## Version [1.1.0](https://github.com/cedx/ngx-cookies.js/compare/v1.0.0...v1.1.0)
- Updated the package dependencies.

## Version [1.0.0](https://github.com/cedx/ngx-cookies.js/compare/v0.2.0...v1.0.0)
- Added the `CookieOptions.provider` static property.
- First stable release.
- Updated the package dependencies.

## Version [0.2.0](https://github.com/cedx/ngx-cookies.js/compare/v0.1.1...v0.2.0)
- Updated the package dependencies.

## Version [0.1.1](https://github.com/cedx/ngx-cookies.js/compare/v0.1.0...v0.1.1)
- Fixed a dependency injection error.

## Version 0.1.0
- Initial release.
