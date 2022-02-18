const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
const mailConfig = {
  host: process.env.EMAIL_SMTP_HOST,
  port: process.env.EMAIL_SMTP_PORT,
  secure: process.env.EMAIL_SMTP_SECURE,
  // lack of ssl commented this. You can uncomment it.
  auth: {
    user: process.env.EMAIL_SMTP_USERNAME,
    pass: process.env.EMAIL_SMTP_PASSWORD,
  },
};
const transporter = nodemailer.createTransport(mailConfig);

exports.send = async function(from, to, subject, html) {
  // send mail with defined transport object
  // visit https://nodemailer.com/ for more options

  const mailOptions = {
    from: from, // sender address e.g. <foo@example.com>
    to: to, // list of receivers e.g. bar@example.com, baz@example.com
    subject: subject, // Subject line e.g. 'Hello ✔'
    // text: text, // plain text body e.g. Hello world?
    html: html, // html body e.g. '<b>Hello world?</b>'
  };

  const email = await transporter.sendMail(mailOptions);

  console.log('email id sent: %s', email.messageId);
  console.log('email sent: %s', email);
  console.log('email response sent: %s', email.response);
};
