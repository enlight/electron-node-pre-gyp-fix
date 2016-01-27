// Copyright (c) 2016 Vadim Macagon
// MIT License, see LICENSE file for full terms.

'use strict';

var path = require('path');
var Module = require('module');

/**
 * Check if a string ends with the given substring.
 * This is to support older Node versions that don't have String.prototype.endsWith().
 *
 * @param candidate The string to examine.
 * @param pattern The substring to look for at the end of `candidate`.
 */
function stringEndsWith(candidate, pattern) {
  var startIndex = candidate.length - pattern.length;
  if (startIndex >= 0) {
    var lastIndex = candidate.indexOf(pattern, startIndex);
    return (lastIndex !== -1) && (lastIndex === startIndex);
  }
  return false;
}

module.exports.install = function () {
  var pathToPatch = path.sep + path.normalize('node-pre-gyp/lib/util/versioning.js');
  // patch Module.prototype._compile
  var compile = Module.prototype._compile;
  Module.prototype._compile = function (content, filename) {
    var normalizedFilename = path.normalize(filename);
    // compile this module as usual
    compile.call(this, content, filename);
    // patch this module if it's none other than node-pre-gyp's versioning.js
    if (this.exports && this.exports.evaluate && stringEndsWith(normalizedFilename, pathToPatch)) {
      var evaluate = this.exports.evaluate;
      this.exports.evaluate = function (package_json, options) {
        // force the correct runtime when running in Electron
        if (process.versions.electron) {
          options = options || {};
          options.runtime = 'electron';
        }
        return evaluate(package_json, options);
      };
    }
  };
};
