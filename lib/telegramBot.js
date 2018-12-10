const TeleBot = require('telebot');
const Models = require('../models');


const bot = new TeleBot('743339121:AAF7oNxcNY0zLS2HHNmVSpQV9OU7CK9NBS8');

console.log("\nGo in telegram and search for thingyAlarm_bot\n");

bot.on(['/start', '/hello'], (msg) => msg.reply.text(`Welcome to our thingyBotAlarm!!

To check if is working you can simply write messages and watch our bot send you back what you had written.

To link this chat to your thingy account just write /register yourAddressMail.
ex /register rocco.sudi@gmail.com

use command /check to see if your account is already linked to your chat!

In this chat you will receive the notification if the alarm is ringing`));

bot.on(/^\/register (.+)$/, (msg, props) => {
  return registerChat(bot,msg,props)
});

// On every text message
bot.on('text', msg => {
    let id = msg.from.id;
    let text = msg.text;
    return bot.sendMessage(id, `You said: ${ text }`);
});

// On every text message
bot.on('/check', msg => {

    return checkChat(bot,msg)
});


bot.connect();

async function registerChat(bot,msg,props) {
  let user = await Models.User.findOne({ email: props.match[1] }).exec();
  if(user){
    await Object.assign(user, {telegramChatId: msg.from.id})
    user.save();
    return bot.sendMessage(msg.from.id, "We found your user! Your username is: "+user.username+"\nNow you can start to get some notifications", { replyToMessage: msg.message_id });


  }
  else {
    const text = "We didn't found any user with this mail: "+props.match[1];
    return bot.sendMessage(msg.from.id, text, { replyToMessage: msg.message_id });
  }

}


async function checkChat(bot,msg) {
  let user = await Models.User.findOne({ telegramChatId: msg.from.id }).exec();
  if(user){
    return bot.sendMessage(msg.from.id, "This chat is linked to the user: "+user.username+"\nYour mail is: "+user.email, { replyToMessage: msg.message_id });
  }
  else {
    const text = "We didn't found any user with this chat";
    return bot.sendMessage(msg.from.id, text, { replyToMessage: msg.message_id });
  }

}
