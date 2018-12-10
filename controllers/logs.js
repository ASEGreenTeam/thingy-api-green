const Models = require('../models');

function prepareResource(ctx, log) {
  return {
    id: log._id,
    direction: log.direction,
    createdAt: log.createdAt,
    imagePath: log.imagePath,
    timestamp: log.timestamp,
    url: `http://${ctx.host}/logs/${log._id}`
  }
}

let controller = {

  create: async (ctx, next) => {
    const log = new Models.Log(ctx.request.body);
    await log.save();
    ctx.body = prepareResource(ctx, log);
    await next();
  },

  read: async (ctx, next) => {
    const id = ctx.params.id;
    const log = await Models.Log.findById(id);
    ctx.body = prepareResource(ctx, log);
    await next();
  },

  update: async (ctx, next) => {
    const id = ctx.params.id;
    const log = await Models.Log.findById(id);
    Object.assign(log, ctx.request.body);
    await log.save();
    ctx.body = prepareResource(ctx, log);
    await next();
  },

  delete: async (ctx, next) => {
    const id = ctx.params.id;
    await Models.Log.deleteOne({ _id: id });
    ctx.status = 204;
    await next();
  },

  list: async (ctx, next) => {
    const logs = await Models.Log.find({});
    ctx.body = Object.keys(logs).map(k => {
      return prepareResource(ctx, logs[k]);
    });
    await next();
  },

  clear: async (ctx, next) => {
    await Models.Log.deleteMany({});
    ctx.status = 204;
    await next();
  },

  getPicture: async (ctx, next) => {
    const id = ctx.params.id;
    const log = await Models.Log.findById(id);
    await next();
  }

}

module.exports = controller;
