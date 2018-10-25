const Koa = require('koa');
const http = require('http');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');

const mongoose = require('mongoose');
const router = require('./routes/index');
const securedRouter = require('./routes/securedRouter');

const jwt = require('./middlewares/jwt');


mongoose.connect('mongodb://localhost/thingy-security', { useNewUrlParser: true })
  .then(() => console.log('connection successful'))
  .catch(err => console.error(err));

const app = new Koa();

// Normal router
app
  .use(logger())
  .use(bodyParser())
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods());

// Secure router
app
  .use(securedRouter.routes())
  .use(securedRouter.allowedMethods());

securedRouter.use(jwt.errorHandler()).use(jwt.jwt());

http.createServer(app.callback()).listen(3000);
