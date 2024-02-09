const nodemailer = require('nodemailer');
const nodemailerConfig = require('./MailerConf') 

const sendEmail = async ({ to, subject, html }) => {
  let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport(nodemailerConfig);

  return transporter.sendMail({
    from: '"TTech" <testlaravelalala@gmail.com>', // sender address
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;