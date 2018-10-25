/**
 * Here, in the index.js , are stored all the routes that doesn't needs
 * an authorization
 *
 *
 *
 */

const Router = require('koa-router');
const router = new Router();
const Controller = require('../controllers');

const jwt = require("../middlewares/jwt");

const bcrypt = require('bcryptjs');

const Models = require('../models');





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


// login
router.post("/login", async (ctx, next) => {
    let username = ctx.request.body.username;
    let password = ctx.request.body.password;

    user = await Models.User.findOne({username: username});


    if(bcrypt.compareSync(password, user.password)) {
        let token = {
            token: jwt.issue({
                user: user.username,
                role: "admin"
            })
        }
        await Models.User.updateOne({_id: user._id}, { token: token.token })
        ctx.body = token

    } else {
        ctx.status = 401;
        ctx.body = {error: "Invalid login"}
    }

    await next();
});


// register
router.post('/register', async (ctx) => {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(ctx.request.body.password, salt);
  var newUser = new Models.User({ username: ctx.request.body.username, password: hash, email: ctx.request.body.email});
  await newUser.save(function (err, newUser) {
   if (err) return console.error(err);
  });

  if (newUser) {

    token = {
        token: jwt.issue({
            user: newUser.username,
            role: "admin"
        })
    }
    await Models.User.updateOne({_id: newUser._id}, { token: token.token })
    ctx.body = token
  } else {
    ctx.status = 400;
    ctx.body = { error: 'error no user is been created' };
  }
  return ctx;
});


/*
router.get('/foos/', Controller.Foos.list);
router.post('/foos/', Controller.Foos.create);
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

*/


module.exports = router;
