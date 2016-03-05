'use strict';
module.exports = (Model) => {
  // Hook
  Model.beforeRemote('create', (context, user, next)=> {
    let req = context.req;
    req.body.fromId= req.accessToken.userId;
    next();
  });
};
