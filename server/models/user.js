'use strict';
const config = require('../config.json');
const mailer = require('../lib/mailer');
const path = require('path');
module.exports = (user) => {

  // Recuperar senha
  user.on('resetPasswordRequest', (info) => {
    let url = config.email.host + '/#/reset';

    let options = {
      template: info.lang + '/recovery.ejs',
      to: info.email,
      from: config.email.from,
      subject: config.email.subject + 'Recuperar senha',
      content: {
        link: url + '?access_token=' + info.accessToken.id,
        text: 'Testando email'
      }
    };

    mailer.send(user, options, (err) => {
      if (err) return console.log('erro ao enviar email para recuperar senha', err);
      console.log('> enviando email de recuperação de senha para:', info.email);
      return true;
    });

  });

  // Enviar email de cadastro
  user.afterRemote('create', function (context, user, next) {
    console.log('Enviar email de cadastro');

    // Enviar email de Bem vindo
    /*

     var options = {
     template: 'br/bemvindo.ejs',
     to: user.email,
     from: config.email.from,
     subject: config.email.subject + 'Bem vindo ao Govivant',
     content: {}
     };

     user.sendTemplate(options, function (err) {
     if (err) return console.log('erro ao enviar email para recuperar senha', err);
     console.log('> enviando email de recuperação de senha para:', info.email);
     });
     */

    // Enviar email para confirmação de conta
    var options = {
      type: 'email',
      to: user.email,
      from: config.email.from,
      subject: config.email.subject + 'Bem vindo ao Govivant',
      template: path.resolve(__dirname, '../../client/email/pt/bemvindo.ejs'),
      redirect: '/verified',
      user: user
    };

    user.verify(options, (err, resp, next) => {
      if (err) return next(err);
      console.log('Email de verificação enviado');
      context
        .res
        .render('response', {
          title: 'Cadastro realizado',
          content: 'Por favor, verifique seu email e clique no link para ativar',
          redirectTo: '/',
          redirectToLinkText: 'Ativar conta'
        });
    });
  });

  // Set the username to the users email address by default.
  user.observe('before save', (ctx, next) => {
    if (ctx.instance) {
      if (ctx.isNewInstance) {
        if(ctx.instance.username === '' || ctx.instance.username === undefined) ctx.instance.username = ctx.instance.email;
      }
      //ctx.instance.status = 'created';
      //ctx.instance.created = Date.now();
    }
    next();
  });


};
