'use strict';
const loopback = require('loopback');
const boot = require('loopback-boot');
const app = module.exports = loopback();

app.use(loopback.logger('dev'));
// Event Limit
require('events').EventEmitter.prototype._maxListeners = 1000;

// Add Changed Mixin to loopback
require('loopback-ds-changed-mixin')(app);

// Add Paginate Mixin to loopback
require('loopback-ds-paginate-mixin')(app);


// -- Add your pre-processing middleware here --


app.start = () => {
  // start the web server
  return app.listen(() => {
    app.emit('started');
    let baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, (err) => {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module) {
    //Comment this app.start line and add following lines
    //app.start();

    // Push Notification
    require('./lib/push')(app);

    let pmx = require('pmx').init({
      http: true,
      // ignore_routes: [/socket\.io/, /notFound/], // Ignore http routes with this pattern (Default: [])
      // errors: true, // Exceptions loggin (default: true)
      // custom_probes: true, // Auto expose JS Loop Latency and HTTP req/s as custom metrics
      // network: true, // Network monitoring at the application level
      // ports: true  // Shows which ports your app is listening on (default: false)
    });

    app.use(pmx.expressErrorHandler());

    // Socket.io
    app.io = require('socket.io')(app.start());



    // const redis = require('socket.io-redis');
    // app.io.adapter(redis({ host: 'localhost', port: 6379 }));

    // app.io.set('store', new app.io.RedisStore({
    //   redisPub: redis.createClient(/* Porta,Host */),
    //   redisSub: redis.createClient(/* Porta,Host */),
    //   redisClient: redis.createClient(/* Porta,Host */)
    // }));

    /*require('socketio-auth')(app.io, {
     authenticate: (value, callback) => {

     console.log('auth', value);

     //get credentials sent by the client
     app
     .models
     .AccessToken
     .find({
     where: {
     and: [
     {userId: value.userId},
     {id: value.id}
     ]
     }
     }, (err, tokenDetail) => {

     console.log('user', tokenDetail);

     if (err) throw err;
     if (tokenDetail.length) {
     callback(null, true);
     } else {
     callback(null, false);
     }
     }); //find function..
     } //authenticate function..
     });
     */
    app.io.on('connection', (socket) => {
      console.log('a user connected');

      socket.on('subscribe', (room) => {
        console.log('joining room', room);
        socket.join(room);
      });

      socket.on('disconnect', () => console.log('user disconnected'));
    });
  }
});
