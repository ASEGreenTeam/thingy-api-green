const Models = require('../models');

function prepareResource(ctx, user) {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    token: user.token,
    thingyId: user.thingyId,
    url: `http://${ctx.host}/user/${user._id}`
  };
}

// Return the sended token
function getToken(ctx) {
  const authHeader = ctx.header.authorization;
  const token = authHeader.substring(7, authHeader.length);
  return token;
}

// Check if the token sended is the same of the one in the database
// Useful for example because a user cannot read from the database the data of another user
function checkUserAccess(ctx, user) {
  if (getToken(ctx) === user.token) {
    return true;
  }
  ctx.body = { error: 'you have no rights' };
  return false;
}

const controller = {

  read: async (ctx, next) => {
    const { id } = ctx.params;
    const user = await Models.User.findById(id);
    if (checkUserAccess(ctx, user)) {
      ctx.body = prepareResource(ctx, user);
    }
    await next();
  },

  update: async (ctx, next) => {
    const { id } = ctx.params;
    const user = await Models.User.findById(id);
    if (checkUserAccess(ctx, user)) {
      Object.assign(user, ctx.request.body);
      await user.save();
      ctx.body = prepareResource(ctx, user);
    }

    await next();
  },

  delete: async (ctx, next) => {
    const { id } = ctx.params;
    await Models.User.deleteOne({ _id: id });
    ctx.status = 204;
    await next();
  },

  list: async (ctx, next) => {
    const users = await Models.User.find({});
    ctx.body = Object.keys(users).map(k => prepareResource(ctx, users[k]));
    await next();
  },

  clear: async (ctx, next) => {
    await Models.User.deleteMany({});
    ctx.status = 204;
    await next();
  },
};

module.exports = controller;
