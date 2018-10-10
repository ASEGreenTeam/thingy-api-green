const Models = require('../models');

function prepareResource(ctx, foo) {
  return {
    id: foo._id,
    foo: foo.foo,
    url: 'http://' + ctx.host + /foos/ + foo._id
  }
}

let controller = {

  create: async (ctx, next) => {
    const foo = new Models.Foo(ctx.request.body);
    await foo.save();
    ctx.body = prepareResource(ctx, foo);
    await next();
  },

  read: async (ctx, next) => {
    const id = ctx.params.id;
    const foo = await Models.Foo.findById(id);
    ctx.body = prepareResource(ctx, foo);
    await next();
  },

  update: async (ctx, next) => {
    const id = ctx.params.id;
    const foo = await Models.Foo.findById(id);
    Object.assign(foo, ctx.request.body);
    await foo.save();
    ctx.body = prepareResource(ctx, foo);
    await next();
  },

  delete: async (ctx, next) => {
    const id = ctx.params.id;
    await Models.Foo.deleteOne({ _id: id });
    ctx.status = 204;
    await next();
  },

  list: async (ctx, next) => {
    const foos = await Models.Foo.find({});
    ctx.body = Object.keys(foos).map(k => {
      return prepareResource(ctx, foos[k]);
    });
    await next();
  },

  clear: async (ctx, next) => {
    await Models.Foo.deleteMany({});
    ctx.status = 204;
    await next();
  }

}

module.exports = controller;
