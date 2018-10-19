const jwt = require('koa-jwt');



let controller = {

  login: async (ctx, next) => {
    if (ctx.request.body.password === 'password') {
      ctx.status = 200;
      ctx.body = {
        token: jwt.sign({ role: 'admin' }, 'A very secret key'), //Should be the same secret key as the one used is ./jwt.js
        message: "Successfully logged in!"
      };
    } else {
      ctx.status = ctx.status = 401;
      ctx.body = {
        message: "Authentication failed"
      };
    }
    return ctx;
    await next();
  }


}

module.exports = controller;
