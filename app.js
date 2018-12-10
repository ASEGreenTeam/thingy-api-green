const Koa = require('koa');
const http = require('http');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const serve = require('koa-static');
const mount = require('koa-mount');
const config = require('config');

const mongoose = require('mongoose');
const router = require('./routes/index');
const mqtt = require('./lib/mqtt');
const securedRouter = require('./routes/securedRouter');


const jwt = require('./middlewares/jwt');

const Models = require('./models');


mongoose.connect(config.DB_ADDRESS, { useNewUrlParser: true })
  .then(() => console.log('connection successful'))
  .catch(err => console.error(err));


async function insertConstant() {
  Object.keys(config.Constants).forEach(async (name) => {
    console.log(`${name}: ${config.Constants[name]}`);
    const constant = await Models.Constants.findOne({ name }).exec();
    if (constant) {
      await Object.assign(constant, { value: config.Constants[name] });
      constant.save();
    } else {
      const newConstant = new Models.Constants({ name, value: config.Constants[name] });
      newConstant.save();
    }
  });
}

insertConstant();

const app = new Koa();

securedRouter.use(jwt.errorHandler()).use(jwt.jwt());

// Normal router
app
  .use(logger())
  .use(bodyParser())
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods())
  .use(mount('/images', serve('./images')));

// Secure router
app
  .use(securedRouter.routes())
  .use(securedRouter.allowedMethods());


http.createServer(app.callback()).listen(config.PORT);
