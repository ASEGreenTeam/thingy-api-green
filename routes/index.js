const Router = require('koa-router');
const router = new Router();
const Controller = require('../controllers');

// middlewares
const jwt = require('../middlewares/jwt.js');
const authenticate = require('../middlewares/authenticate.js');

// Error handling
router.use(async (ctx, next) => {
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

router.get('/foos/*', async (ctx) => {
  if (ctx.isAuthenticated()) {
    console.log(ctx._matchedRoute);
    ctx.redirect(ctx._matchedRoute);
  } else {
    ctx.redirect('/auth/login');
    ctx.body = { success: false };
    ctx.throw(401);
  }
});

// login
router.post('/login/', function *(next) {
  authenticate(this);
});

// Routes

// Foos
router.post('/foos/', jwt, Controller.Foos.create);
router.get('/foos/', jwt, Controller.Foos.create);
//router.get('/foos/', Controller.Foos.list);
//router.post('/foos/', Controller.Foos.create);
router.delete('/foos/', Controller.Foos.clear);
router.get('/foos/:id', Controller.Foos.read);
router.patch('/foos/:id', Controller.Foos.update);
router.delete('/foos/:id', Controller.Foos.delete);

// Logs
router.get('/logs/', Controller.Logs.list);
router.post('/logs/', Controller.Logs.create);
router.delete('/logs/', Controller.Logs.clear);
router.get('/logs/:id', Controller.Logs.read);
router.patch('/logs/:id', Controller.Logs.update);
router.delete('/logs/:id', Controller.Logs.delete);




module.exports = router;
