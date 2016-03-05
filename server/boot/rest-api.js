'use strict';
module.exports = (server) => server.use(server.get('restApiRoot'), server.loopback.rest());
