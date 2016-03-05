'use strict';
module.exports = (file, path) => JSON.parse(require('fs').readFileSync(__dirname + path + file));
