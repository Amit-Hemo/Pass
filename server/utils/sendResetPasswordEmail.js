const mailer = require('../config/mailer');

async function sendResetPasswordEmail({ targetEmail }) {
  const imageId = require('crypto').randomBytes(10).toString('hex');
  try {
    await mailer.sendMail({
      from: process.env.EMAIL_AUTH_USER,
      to: targetEmail,
      subject: 'Reset Password',
      html: `
      <!DOCTYPE html>
      <html lang="he">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body>
          <div style="font-family: Helvetica,Arial,sans-serif;line-height:2; direction: rtl;">
              <div style="margin:50px auto;padding:20px 0; max-width: 500px;">
                  <div
                      style="border-bottom:1px solid #eee; background-color: #00B8D4; text-align: center; padding-top: .5rem;">
                      <img src="cid:${imageId}" alt="PASS logo"
                          style="object-fit: cover; width: 10rem; height: 4rem; margin: 0 auto;">
                  </div>
                  <p>תודה שבחרת להשתמש בשירותי PASS. <br> <b>סיסמתך שונתה בהצלחה.</b></p>
                  <p style="font-size:0.9em;">בברכה,<br />PASS</p>
                  <hr style="border:none;border-top:1px solid #eee" />
              </div>
          </div>
      </body>
      </html>
    `,
      attachments: [
        {
          cid: imageId,
          filename: 'header_logo.png',
          path: './assets/header_logo.png',
        },
      ],
    });
  } catch (err) {
    throw new Error('Error while sending email was occurred');
  }
}

module.exports = sendResetPasswordEmail;