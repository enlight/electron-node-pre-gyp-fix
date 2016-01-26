# electron-node-pre-gyp-fix

## Overview
[node-pre-gyp](https://github.com/mapbox/node-pre-gyp) is used by some NPM packages with native
depedencies (e.g. `sqlite3`, `node-inspector`) to save end-users the trouble of compiling native
dependencies. However if you wish to use any of these NPM packages in
[Electron](https://github.com/atom/electron) you have to recompile them for your particular
version of Electron, this is where `node-pre-gyp` becomes a PITA because it can't find the compiled
native dependencies. There are pending PRs (https://github.com/mapbox/node-pre-gyp/pull/187 and
https://github.com/mapbox/node-pre-gyp/pull/177) to address this issue but so far they've received
no response from the maintainers. Meanwhile developers using Electron get tripped up by this issue
over and over again. This package aims to provide an easy to use (and hopefully robust) workaround
until one of the aforementioned PRs finally get merged in.

## Usage

Install the package:
```shell
npm install enlight/electron-node-pre-gyp-fix --save
```

Then install the fix before requiring any modules with native dependencies:
```javascript
require('electron-node-pre-gyp-fix').install();
```

## How it works

When the `install()` function is invoked it replaces the existing function in
`require.extensions['.js']` that's responsible for loading `.js` files with one that
monkey-patches the `evaluate()` function exported from `node-pre-gyp/lib/util/versioning.js`.
Note that it doesn't matter how many copies of `node-pre-gyp` are installed in your `node_modules`
tree, any `node-pre-gyp` that gets loaded after `install()` is invoked will get patched.

## Limitations

This package may be incompatible with [electron-compile](https://github.com/electronjs/electron-compile)
because it modifies `require.extensions`.

## License
MIT
