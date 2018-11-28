/**
 * Here, in the secureRouter.js , are stored all the routes that needs
 * an authorization
 *
 *
 *
 */


const Router = require('koa-router');

const securedRouter = new Router();
const Controller = require('../controllers');

// Error handling
securedRouter.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    console.log(error);
    ctx.status = error.status || 500;
    ctx.type = 'json';
    ctx.body = { error: error.message || 'Something went wrong!' };
    ctx.app.emit('error', error, ctx);
  }
});


// userSchema
securedRouter.get('/users/', Controller.Users.list);
securedRouter.get('/users/:id', Controller.Users.read);
securedRouter.patch('/users/:id', Controller.Users.update);
securedRouter.delete('/users/:id', Controller.Users.delete);

securedRouter.get('/users/registerThingy/', Controller.Users.registerThingy);
securedRouter.get('/takeSnapshot/', Controller.Users.takeSnapshot);

// Foos
securedRouter.get('/foos/', Controller.Foos.list);
securedRouter.post('/foos/', Controller.Foos.create);
securedRouter.delete('/foos/', Controller.Foos.clear);
securedRouter.get('/foos/:id', Controller.Foos.read);
securedRouter.patch('/foos/:id', Controller.Foos.update);
securedRouter.delete('/foos/:id', Controller.Foos.delete);

// Logs
securedRouter.get('/logs/', Controller.Logs.list);
securedRouter.post('/logs/', Controller.Logs.create);
securedRouter.delete('/logs/', Controller.Logs.clear);
securedRouter.get('/logs/:id', Controller.Logs.read);
securedRouter.patch('/logs/:id', Controller.Logs.update);
securedRouter.delete('/logs/:id', Controller.Logs.delete);

securedRouter.get('/constants/:name', Controller.Constants.read);

module.exports = securedRouter;
