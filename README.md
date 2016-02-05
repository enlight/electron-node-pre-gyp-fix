# electron-node-pre-gyp-fix

**NOTE**: I strongly recommend using the `node-pre-gyp` workaround in
[electron-rebuild](https://github.com/electronjs/electron-rebuild) instead, as the monkey-patching
this module performs doesn't appear to work with `node-inspector`.

## Overview
[node-pre-gyp](https://github.com/mapbox/node-pre-gyp) is used by some NPM packages with native
depedencies (e.g. `sqlite3`, `node-inspector`) to save end-users the trouble of compiling those
native dependencies. However if you wish to use any of these NPM packages in
[Electron](https://github.com/atom/electron) you have to recompile them for your particular
version of Electron. Unfortunately `node-pre-gyp` can't find the native depedencies you've compiled
because it looks for them in the wrong place. There are pending PRs ([#187](https://github.com/mapbox/node-pre-gyp/pull/187) and
[#177](https://github.com/mapbox/node-pre-gyp/pull/177)) to address this issue but so far they've received
no response from the maintainers. Meanwhile developers using Electron get tripped up by this issue
over and over again. This package aims to provide an easy to use (and hopefully robust) workaround
until one of the aforementioned PRs finally gets merged in.

## Usage

Install the package:
```shell
npm install enlight/electron-node-pre-gyp-fix --save
```

Then install the fix before requiring `node-pre-gyp` or any modules that require it:
```javascript
require('electron-node-pre-gyp-fix').install();
```
The fix must be installed once in every Electron process, and should be done as early as possible
during the initializion of a process.

## How it works

When the `install()` function is invoked it monkey-patches `Module.prototype._compile()` so that
when `node-pre-gyp/lib/util/versioning.js` is compiled the `evaluate()` function that's exported
by that module is monkey-patched to do the right thing when invoked within an Electron process.
Note that it doesn't matter how many copies of `node-pre-gyp` are installed in your `node_modules`
tree, all instances of the `evaluate()` function will be monkey-patched at runtime
provided `install()` is called before requiring `node-pre-gyp`.

## License
MIT
