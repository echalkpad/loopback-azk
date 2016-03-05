// FILE PATH: server/middleware/request-logging.js

// Inspiration for this comes from https://github.com/villadora/express-bunyan-logger

var _ = require('lodash');
var appRoot = require('app-root-path');
var bunyan = require('bunyan');
var useragent = require('useragent');
var util = require('util');

var DEFAULT_CONFIG = {
  // Extended config which is removed
  features: ['ip','method','url','referer','userAgent','body','responseTime','statusCode'],
  parseUA: false,
  truncateBody: false,

  bunyan: {
    name: 'loopback-requests',
    serializers: {
      req: bunyan.stdSerializers.req,
      res: bunyan.stdSerializers.res,
      err: bunyan.stdSerializers.err
    },
    streams: [{
      type: 'file',
      path: appRoot.resolve('/logs/requests.log'),
      level: 'info'
    }]
  }
};

module.exports = function (config) {
  config = _.merge(DEFAULT_CONFIG, config);

  var logger = bunyan.createLogger(config.bunyan);

  return function (req, res, next) {
    var startTime = process.hrtime();

    var logCtx = { requestId: req.id };
    if (req.accessToken) {
      logCtx.accessToken = req.accessToken.id;
      logCtx.userId = req.accessToken.userId;
    }

    var childLogger = logger.child(logCtx, true);

    res.on('finish', function() {
      childLogger.info(buildPayload(), 'request done');
    });

    res.on('close', function () {
      childLogger.warn(buildPayload(), 'socket closed');
    });

    next();

    function buildPayload() {
      var payload;
      var hrResponseTime = process.hrtime(startTime);
      var responseTime = hrResponseTime[0] * 1e3 + hrResponseTime[1] / 1e6;

      var properties = {
        ip: req.ip || req.connection.remoteAddress ||
        (req.socket && req.socket.remoteAddress) || (req.socket.socket && req.socket.socket.remoteAddress),
        method: req.method,
        url: (req.baseUrl || '') + (req.url || ''),
        referer: req.header('referer') || req.header('referrer'),
        userAgent: req.header('user-agent'),
        body: req.body,
        httpVersion: req.httpVersionMajor + '.' + req.httpVersionMinor,
        responseTime: responseTime,
        hrResponseTime: hrResponseTime,
        statusCode: res.statusCode,
        requestHeaders: req.headers,
        responseHeaders: res._headers,
        req: req,
        res: res
      };

      if (!config.features || config.features === '*') {
        payload = properties;
      } else {
        payload = _.pick(properties, config.features);
      }

      if (payload.userAgent && config.parseUA) {
        payload.userAgent = useragent.parse(payload.userAgent);
      }

      if (payload.body && config.truncateBody) {
        if (config.truncateBody === true) {
          config.truncateBody = 20;
        }
        payload.body = util.inspect(payload.body).substring(0, config.truncateBody);
      }

      return payload;
    }
  };
};
