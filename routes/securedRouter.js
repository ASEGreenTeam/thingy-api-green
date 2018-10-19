const Router = require('koa-router');
const securedRouter = new Router();
const Controller = require('../controllers');

// secure Router







// Error handling
securedRouter.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    console.log(error);
    ctx.status = error.status || 500;
    ctx.type = 'json';
    ctx.body = { 'error': error.message || 'Something went wrong!' };
    ctx.app.emit('error', error, ctx);
  }
});


// Routes

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




module.exports = securedRouter;
