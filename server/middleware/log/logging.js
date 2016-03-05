// FILE PATH: server/middleware/logging.js

var _ = require('lodash');
var fs = require('fs');
var appRoot = require('app-root-path');
var bunyan = require('bunyan');
var uuid = require('uuid');

var loopback = require('loopback');

var DEFAULT_CONFIG = {
  name: 'loopback',
  serializers: {
    req: bunyan.stdSerializers.req,
    res: bunyan.stdSerializers.res,
    err: bunyan.stdSerializers.err
  },
  streams: [{
    type: 'stream',
    stream: process.stderr,
    level: 'error'
  },
    {
      type: 'file',
      path: appRoot.resolve('/logs/common.log'),
      // FIXME: Use LB environment configs to control this
      level: (process.env.NODE_ENV !== 'production')?'debug':'info'
    }]
};

module.exports = function (config) {
  config = _.merge(DEFAULT_CONFIG, config);

  // Attempt to ensure file logging output path is available
  var logPath = appRoot.resolve('/logs');
  if (!fs.existsSync(logPath)) {
    try {
      fs.mkdirSync(logPath);
    } catch (e) {}
  }

  var logger = bunyan.createLogger(config);

  return function (req, res, next) {
    // Generate a new unique request ID if necessary
    req.id = res.id = req.id || uuid.v4();
    res.setHeader('Request-Id', req.id);

    var logCtx = { requestId: req.id };
    if (req.accessToken) {
      logCtx.accessToken = req.accessToken.id;
      logCtx.userId = req.accessToken.userId;
    }

    req.log = logger.child(logCtx, true);

    var loopbackContext = loopback.getCurrentContext();
    if (loopbackContext) loopbackContext.set('logger', req.log);

    next();
  };
};
