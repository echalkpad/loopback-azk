const fs = require('fs');
// const easyimage = require('easyimage');

module.exports = (File) => {


  /*

  File.afterRemote('upload', function(ctx, remoteMethodOutput, next) {

    var dir = './server/storage/';

    var files = ctx.result.result.files.file;
    var params = ctx.result.result.fields;

    var currPath = dir + files[0].container + '/' + files[0].name;
    var newPath = dir + files[0].container + '/150_150/new.jpg';

    // easyimage https://github.com/hacksparrow/node-easyimage
    easyimage.crop({src: currPath, dst: newPath, cropwidth:150, cropheight:150, x:30, y:50}).then(
      function(image) {
        console.log('finished!');
      }
    );

    next();
  });*/

  // Hooks
  File.beforeRemote('create', (context, user, next)=> {
    const req = context.req;
    if ( req.accessToken.userId) req.body.userId = req.accessToken.userId;
    next();
  });

  File.upload = (ctx, options, cb) => {

    const config = require('./../lib/load-json');
    const Container = File.app.models.Container;

    Container
      .upload(ctx.req, ctx.result, options, function (err, fileObj) {
        console.log('Upload called!');
        if (err) {
          console.log('err', err);
          cb(err);
        } else {
          console.log('no err');
          var fileInfo = fileObj.files.file[0];
          File
            .create({
              name: fileInfo.name,
              type: fileInfo.type,
              container: 'cnd.govivant.com',
              url: config.production + 'cdn.govivant.com/download/' + fileInfo.name
            }, function (err, obj) {
              if (err !== null) {
                cb(err);
              } else {
                cb(null, obj);
              }
            });
        }
      });

  };

  File.remoteMethod('upload', {
        description: 'Uploads a file',
        accepts: [
          {arg: 'ctx', type: 'object', http: {source: 'context'}},
          {arg: 'options', type: 'object', http: {source: 'query'}}
        ],
        returns: {
          arg: 'fileObject', type: 'object', root: true
        },
        http: {verb: 'post'}
      }
    );
};
