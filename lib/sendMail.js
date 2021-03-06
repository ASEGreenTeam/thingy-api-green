const nodemailer = require('nodemailer');
const Models = require('../models');

const SendMail = function SendMail() {
  this.send =  function send(to, header, text) {
    if (!to) {
      to = 'matteo.badaracco@unifr.ch';
    }

    let serverAddress="";
    const costants = Models.Constants.findOne({ name: "clientAddress" }).exec();
    if(!costants && !costants.value){
      serverAddress="localhost:4200";
    }

    if (!text) {
      let d = new Date();
      text = `Someone has open your door at this time: ${d}

You can find the pictures at this link: ${serverAddress}/pictures
      `;
    }
    if (!header) {
      header = 'Alarm!! Your door has been opened'
    }



    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "sec.mythingy",
        pass: "ThingyGreen18"
      }
    });

    const mailOptions = {
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
  };
};

module.exports = new SendMail();
