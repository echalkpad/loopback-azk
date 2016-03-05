module.exports = (Model) => {
  'use strict';
  // Model is the model Class
  //options is an object containing the config properties from model definition
  Model.defineProperty('created', {type: Date, default: '$now'});
  Model.defineProperty('modified', {type: Date, default: '$now'});
};
