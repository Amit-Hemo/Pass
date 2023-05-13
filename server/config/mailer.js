const nodemailer = require('nodemailer');

const mailer = nodemailer.createTransport({
  pool: true,
  host: 'smtp-mail.outlook.com',
  auth: {
    user: process.env.EMAIL_AUTH_USER,
    pass: process.env.EMAIL_AUTH_PASSWORD,
  },
});

module.exports = mailer;
