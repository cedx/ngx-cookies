# Installation

## Requirements
Before installing **Cookie Service for Angular**, you need to make sure you have [Node.js](https://nodejs.org)
and [npm](https://www.npmjs.com), the Node.js package manager, up and running.

!!! warning
    Cookie Service for Angular requires Node.js >= **12.14.0**.

You can verify if you're already good to go with the following commands:

```shell
node --version
# v13.6.0

npm --version
# 6.13.4
```

!!! info
    If you plan to play with the package sources, you will also need
    [Gulp](https://gulpjs.com) and [Material for MkDocs](https://squidfunk.github.io/mkdocs-material).

## Installing with npm package manager

### 1. Install it
From a command prompt, run:

```shell
npm install @cedx/ngx-cookies
```

### 2. Import it
Now in your [TypeScript](https://www.typescriptlang.org) code, you can use:

```typescript
import {Cookies, CookieOptions} from '@cedx/ngx-cookies';
```

### 3. Use it
See the [usage information](usage/api.md).
