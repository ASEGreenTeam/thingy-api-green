const Router = require('koa-router');
const router = new Router();
const Controller = require('../controllers');

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

// Routes

// Foos
router.get('/foos/', Controller.Foos.list);
router.post('/foos/', Controller.Foos.create);
router.delete('/foos/', Controller.Foos.clear);
router.get('/foos/:id', Controller.Foos.read);
router.patch('/foos/:id', Controller.Foos.update);
router.delete('/foos/:id', Controller.Foos.delete);

module.exports = router;
