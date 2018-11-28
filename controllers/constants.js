const Models = require('../models');

function prepareResource(ctx, costant) {
  return {
    id: costant._id,
    name: costant.name,
    value: costant.value,
    url: 'http://' + ctx.host + /costant/ + costant._id
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
