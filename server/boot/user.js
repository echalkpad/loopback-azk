'use strict';
module.exports = (app) => {

  // User Routes
  const User = app.models.User;

  // Reset Password
  app.post('/request-password-reset', (req, res) => {
    const options = {
      email: req.body.email
    };

    User.resetPassword(options, (err) => {
      if (err) return res.status(401).send(err);

      res.render('response', {
        title: 'Recuperar senha',
        content: 'Verifique seu email',
        redirectTo: '/',
        redirectToLinkText: 'Ativar'
      });
    });
  });

  // Post token and save new Password
  app.post('/reset-password', (req, res) => {
    if (!req.accessType) return res.sendStatus(401);
    // Confere se as senhas confirmam
    if (!req.body.password || !req.body.confirmation || req.body.password !== req.bodyconfirmation) {
      return res.sendStatus(400, new Error('Password não conferem'));
    }

    User
      .findById(req.accessToken.userId, (err, user) => {
      if (err) return res.sendStatus(404);
      user
        .updateAttribute('password', req.body.password, (err, user) => {
          if (err) return res.sendStatus(404);
          console.log('Nova senha salva com sucesso');
          res.render('response', {
            title: 'Nova senha salva com scuesso',
            content: 'Sua senha foi salva com sucesso',
            redirectTo: '/',
            redirectToLinkText: 'Ativar'
          });
        });
    });
  });
};
