const Models = require('../models');

function prepareResource(ctx, user) {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    url: 'http://' + ctx.host + /user/ + user._id
  }
}

let controller = {

  read: async (ctx, next) => {
    const id = ctx.params.id;
    const user = await Models.User.findById(id);
    ctx.body = prepareResource(ctx, user);
    await next();
  },

  update: async (ctx, next) => {
    const id = ctx.params.id;
    const user = await Models.User.findById(id);
    Object.assign(user, ctx.request.body);
    await user.save();
    ctx.body = prepareResource(ctx, user);
    await next();
  },

  delete: async (ctx, next) => {
    const id = ctx.params.id;
    await Models.User.deleteOne({ _id: id });
    ctx.status = 204;
    await next();
  },

  list: async (ctx, next) => {
    const foos = await Models.User.find({});
    ctx.body = Object.keys(foos).map(k => {
      return prepareResource(ctx, foos[k]);
    });
    await next();
  },

  clear: async (ctx, next) => {
    await Models.User.deleteMany({});
    ctx.status = 204;
    await next();
  }

}

module.exports = controller;
