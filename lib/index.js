// Copyright (c) 2016 Vadim Macagon
// MIT License, see LICENSE file for full terms.

var path = require('path');

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
  // override the standard loader for .js files
  var loadModule = require.extensions['.js'];
  require.extensions['.js'] = function (module, filename) {
    var normalizedFilename = path.normalize(filename);
    // load and compile the file as usual
    loadModule(module, filename);
    // monkey patch node-pre-gyp
    if (module.exports.evaluate && stringEndsWith(normalizedFilename, pathToPatch)) {
      var evaluate = module.exports.evaluate;
      module.exports.evaluate = function (package_json, options) {
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
