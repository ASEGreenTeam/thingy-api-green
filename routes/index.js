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

    await Models.User.findOne({username: username}).exec()
      .then( user => {
        if(bcrypt.compareSync(password, user.password)) {
          let token = {
              token: jwt.issue({
                  user: user.username,
                  role: "admin"
              })
          }
          Models.User.updateOne({_id: user._id}, { token: token.token }).exec();
          ctx.body = token;
        } else {
          ctx.status = 401;
          ctx.body = {error: "Invalid password"}
        }
      })
      .catch( error => {
        ctx.status = 401;
        ctx.body = {error: "Invalid login"}
      });

    await next();
});


// register
router.post('/register', async (ctx, next) => {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(ctx.request.body.password, salt);
  let newUser = new Models.User({ username: ctx.request.body.username, password: hash, email: ctx.request.body.email});
  await newUser.save()
    .then( newUser => {
      console.log(newUser);
      token = {
          token: jwt.issue({
              user: newUser.username,
              role: "admin"
          })
      }
      Models.User.updateOne({_id: newUser._id}, { token: token.token }).exec();
      ctx.body = token;
    })
    .catch( error => {
      console.error(error)
      ctx.body = { error: error.message }
      ctx.status = 400;
    });

  await next();
});



// just trying to send emails
router.post("/email", async (ctx, next) => {
    var d = new Date();
    let text = "Someone has open your door at this time: "+d;
    let header = "Alarm!! Your door has been opened"
    let to = 'matteo.badaracco@unifr.ch';

    'use strict';
    const nodemailer = require('nodemailer');

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: "sec.mythingy",
            pass: "ThingyGreen18"
        }
    });

    var mailOptions = {
      from: 'sec.mythingy@gmail.com',
      to: to,
      subject: header,
      text: text
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);

    });


    await next();
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
