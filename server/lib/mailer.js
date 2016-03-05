'use strict';
var exports = module.exports = {};
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');

exports.send = (user, options, cb) => {
  console.log('Send template');

  fs.readFile(path.resolve(__dirname + '/../../client/email/' + options.template), 'utf8', (err, file) => {
    if (err) return cb(err);

    let mailOptions = {
      from: options.from,
      to: options.to,
      subject: options.subject,
      html: ejs.render(file, {data: options.content})
    };

    console.log(options.content);

    user
      .app
      .models
      .Email
      .send(mailOptions, (err) => {
        if (err) return cb(err);
        console.log('> email enviado com suceso:', options.template, options.to);
      });

  });
};
