const Models = require('../models');
const mqtt = require('../lib/mqtt');


function prepareResource(ctx, thingy) {
  return {
    id: thingy._id,
    uuid: thingy.uuid,
    alarm: thingy.alarm,
    lightAlert: thingy.lightAlert,
    soundAlert: thingy.soundAlert,
    imagesCapture: thingy.imagesCapture,
    url: 'http://' + ctx.host + /thingy/ + thingy._id
  }
}

// Return the sended token
function getToken(ctx){
  authHeader=ctx.header.authorization;
  token = authHeader.substring(7, authHeader.length);
  return token;
}

// Check if the token sended is the same of the one in the database
// Useful for example because a user cannot read from the database the data of another user
function getUserFromToken(ctx){
  user = Models.User.findOne({token: getToken(ctx)});

  return user;
}

let controller = {


  readMy: async (ctx, next) => {
    let user = getUserFromToken(ctx);
    const thingy = await Models.Thingy.findById(user.thingyId);

    ctx.body = prepareResource(ctx, thingy);

    await next();
  },

  updateMy: async (ctx, next) => {
    let user = getUserFromToken(ctx);
    const thingy = await Models.Thingy.findById(user.thingyId);

    Object.assign(thingy, ctx.request.body);
    await thingy.save();
    ctx.body = prepareResource(ctx, thingy);


    await next();
  },

  deleteMy: async (ctx, next) => {
    let user = getUserFromToken(ctx);
    await Models.Thingy.deleteOne({ _id:  user.thingyId});
    ctx.status = 204;
    await next();
  },

  registerMy: async (ctx, next) => {
    let user = getUserFromToken(ctx);
    mqtt.register_callback('registerThingy', (uuid) => {
      const thingy = Models.Thingy.findByUuid(uuid);
      user.thingyId = thingy._id;
      user.save();
    });
    ctx.status = 200;
    await next();
  },

  read: async (ctx, next) => {
    const id = ctx.params.id;
    const thingy = await Models.Thingy.findById(id);

      ctx.body = prepareResource(ctx, thingy);

    await next();
  },

  update: async (ctx, next) => {
    const id = ctx.params.id;
    const thingy = await Models.Thingy.findById(id);

    Object.assign(thingy, ctx.request.body);
    await thingy.save();
    ctx.body = prepareResource(ctx, thingy);


    await next();
  },

  delete: async (ctx, next) => {
    const id = ctx.params.id;
    await Models.Thingy.deleteOne({ _id: id });
    ctx.status = 204;
    await next();
  },

  list: async (ctx, next) => {
    const foos = await Models.Thingy.find({});
    ctx.body = Object.keys(foos).map(k => {
      return prepareResource(ctx, foos[k]);
    });
    await next();
  },

  clear: async (ctx, next) => {
    await Models.Thingy.deleteMany({});
    ctx.status = 204;
    await next();
  },

  create: async (ctx, next) => {
    const thingy = new Models.Thingy(ctx.request.body);
    await thingy.save();
    ctx.body = prepareResource(ctx, thingy);
    await next();
  }

}

module.exports = controller;
