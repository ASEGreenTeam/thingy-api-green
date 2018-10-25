const jwt = require('koa-jwt');
const jsonwebtoken = require('jsonwebtoken');

const SECRET = Date.now().toString();
const jwtInstance = jwt({ secret: SECRET });


function JWTErrorHandler(ctx, next) {
  return next().catch((err) => {
    console.log(err);
    if (401 === err.status) {
      ctx.status = 401;
      ctx.body = {
        error: 'Not authorized'
      };
    } else {
      throw err;
    }
  });
}


// helper function
module.exports.issue = payload => jsonwebtoken.sign(payload, SECRET);

module.exports.jwt = () => jwtInstance;
module.exports.errorHandler = () => JWTErrorHandler;
