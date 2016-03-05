'use strict';
module.exports = (server) => {
  // Install a `/` route that returns server status
  let router = server.loopback.Router();
  router.get('/status', server.loopback.status());
  server.use(router);
};
