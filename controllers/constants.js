const Models = require('../models');

function prepareResource(ctx, constant) {
  return {
    id: constant._id,
    name: constant.name,
    value: constant.value,
    url: 'http://' + ctx.host + /constant/ + costant._id
  }
}

let controller = {


  read: async (ctx, next) => {
    const name = ctx.params.name;
    const costant = await Models.Costants.findOne({ name: name }).exec();
    ctx.body = prepareResource(ctx, costant);
    await next();
  },



}

module.exports = controller;
