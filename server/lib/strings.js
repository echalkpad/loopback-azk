module.exports = {};

module.exports.captalize = captalize;
module.exports.upperCase = upperCase;
module.exports.lowercase = lowercase;

function captalize(s) {
  return s[0].toUpperCase() + s.substr(1);
}

function upperCase(s) {
  return s.toUpperCase();
}

function lowercase(s) {
  return s.lowercase();
}
