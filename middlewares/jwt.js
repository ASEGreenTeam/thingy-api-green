const koaJwt = require('koa-jwt');

module.exports = koaJwt({
  secret: 'A very secret key', // Should not be hardcoded
});
