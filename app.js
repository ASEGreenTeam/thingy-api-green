const Koa = require('koa');
const http = require('http');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const serve = require('koa-static');
const mount = require('koa-mount');

const mongoose = require('mongoose');
const router = require('./routes/index');
const mqtt = require('./lib/mqtt');
const securedRouter = require('./routes/securedRouter');

const jwt = require('./middlewares/jwt');

const Models = require('./models');

const telegramBot = require('./lib/telegramBot');
const TeleBot = require('telebot');

mongoose.connect('mongodb://localhost/thingy-security', { useNewUrlParser: true })
  .then(() => console.log('connection successful'))
  .catch(err => console.error(err));

insertConstant();


async function insertConstant() {
  var constants = require("./constants.json");
  for(var name in constants){
      console.log(name+": "+constants[name]);
      let constant = await Models.Constants.findOne({ name: name }).exec();
      if(constant){
        await Object.assign(constant, {value: constants[name]});
        constant.save();
      }else{
        let newConstant = new Models.Constants({name: name, value: constants[name]});
        newConstant.save();
      }

  }
}





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


http.createServer(app.callback()).listen(3000);
