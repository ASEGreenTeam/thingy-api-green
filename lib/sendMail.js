'use strict';
const nodemailer = require('nodemailer');
 const sendMail = function sendMail(to,header,text){
   if not(to){
    to = 'matteo.badaracco@unifr.ch';
  }
   if not(text){
    var d = new Date();
    text = "Someone has open your door at this time: "+d;
  }
   if not(header){
    header = "Alarm!! Your door has been opened"
  }
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
 }
 module.exports = new sendMail();
