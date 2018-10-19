const Koa = require('koa');
const http = require('http');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');

const router = require('./routes/index');
const securedRouter = require('./routes/securedRouter');
const models = require('./models')

const mqtt = require('./lib/mqtt');

const jwt = require("./middlewares/jwt");


const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/thingy-security')
  .then(() =>  console.log('connection successful'))
  .catch((err) => console.error(err));

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
.use(securedRouter.allowedMethods())

securedRouter.use(jwt.errorHandler()).use(jwt.jwt());

http.createServer(app.callback()).listen(3000);
