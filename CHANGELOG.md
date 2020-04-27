# Changelog

## Version [3.1.0](https://git.belin.io/cedx/ngx-cookies/compare/v3.0.0...v3.1.0)
- Dropped support for [GitHub Packages](https://github.com/features/packages).
- Raised the [Node.js](https://nodejs.org) constraint.
- Updated the documentation.
- Updated the package dependencies.

## Version [3.0.0](https://git.belin.io/cedx/ngx-cookies/compare/v2.4.0...v3.0.0)
- Breaking change: upgraded [Angular](https://angular.io) to version 9.
- Ported the tests to [Mocha](https://mochajs.org) and [Chai](https://www.chaijs.com).
- Updated the package dependencies.

## Version [2.4.0](https://git.belin.io/cedx/ngx-cookies/compare/v2.3.0...v2.4.0)
- Added the `putIfAbsent()` and `putObjectIfAbsent()` methods to the `Cookies` class.
- Updated the package dependencies.

## Version [2.3.0](https://git.belin.io/cedx/ngx-cookies/compare/v2.2.0...v2.3.0)
- Updated the package dependencies.

## Version [2.2.0](https://git.belin.io/cedx/ngx-cookies/compare/v2.1.0...v2.2.0)
- Dropped support for [Angular Universal](https://angular.io/guide/universal).
- Updated the package dependencies.

## Version [2.1.0](https://git.belin.io/cedx/ngx-cookies/compare/v2.0.0...v2.1.0)
- Added the `CookieOptions.fromString()` method.
- Added support for [Angular Universal](https://angular.io/guide/universal).
- Removed the restriction on allowed cookie names.
- Updated the package dependencies.

## Version [2.0.0](https://git.belin.io/cedx/ngx-cookies/compare/v1.3.0...v2.0.0)
- Breaking change: changed the signature of the `CookieOptions` class constructor.
- Breaking change: dropped the [CommonJS modules](https://nodejs.org/api/modules.html) in favor of [ECMAScript](https://nodejs.org/api/esm.html) ones.
- Breaking change: ported the source code to [TypeScript](https://www.typescriptlang.org).
- Breaking change: raised the required [Node.js](https://nodejs.org) version.
- Breaking change: removed the `CookieModule` module.
- Breaking change: removed the `COOKIE_OPTIONS` injection token.
- Breaking change: upgraded [Angular](https://angular.io) to version 8.
- Added the `CookieOptions.fromJson()` method.
- Added the `Cookies.toJSON()` method.
- Added an example code.
- Added a user guide based on [MkDocs](http://www.mkdocs.org).
- Replaced the [ESDoc](https://esdoc.org) documentation generator by [Compodoc](https://compodoc.app).
- Removed the dependency on [Babel](https://babeljs.io) compiler.
- Updated the build system to [Gulp](https://gulpjs.com) version 4.
- Updated the documentation.
- Updated the package dependencies.

## Version [1.3.0](https://git.belin.io/cedx/ngx-cookies/compare/v1.2.0...v1.3.0)
- Changed licensing for the [MIT License](https://opensource.org/licenses/MIT).
- Replaced the `ec.cookie-mock` module by `jsdom` for testing.
- Updated the package dependencies.

## Version [1.2.0](https://git.belin.io/cedx/ngx-cookies/compare/v1.1.0...v1.2.0)
- Added support for [Browserslist](http://browserl.ist) shared settings.
- Added the [`[Symbol.toStringTag]`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toStringTag) property to the `Cookies` and `CookieOptions` classes.
- Moved the [Angular](https://angular.io) and [RxJS](http://reactivex.io/rxjs) dependencies to peer ones.
- Updated the package dependencies.

## Version [1.1.0](https://git.belin.io/cedx/ngx-cookies/compare/v1.0.0...v1.1.0)
- Updated the package dependencies.

## Version [1.0.0](https://git.belin.io/cedx/ngx-cookies/compare/v0.2.0...v1.0.0)
- Added the `CookieOptions.provider` static property.
- First stable release.
- Updated the package dependencies.

## Version [0.2.0](https://git.belin.io/cedx/ngx-cookies/compare/v0.1.1...v0.2.0)
- Updated the package dependencies.

## Version [0.1.1](https://git.belin.io/cedx/ngx-cookies/compare/v0.1.0...v0.1.1)
- Fixed a dependency injection error.

## Version 0.1.0
- Initial release.
