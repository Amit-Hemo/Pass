const mailer = require("../config/mailer");
const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

function createCartTable(cart, tdStyle) {
  let table = "";

  cart.forEach((cartItem) => {
    table += `<tr>
    <td style="${tdStyle}">
      ${cartItem.product.name} ${cartItem.product.size}
    </td>
    <td style="${tdStyle}">${cartItem.quantity} </td>
    <td style="${tdStyle}">${cartItem.product.price} ש"ח</td>
    <td style="${tdStyle}"> ${
      cartItem.product.price * cartItem.quantity
    } ש"ח</td>
  </tr>`;
  });

  return table;
}

async function sendReceiptEmail({
  targetEmail,
  transactionId,
  merchantId,
  transactionDate,
  transactionTime,
  amount,
  cardType,
  last4,
  firstName,
  lastName,
  email,
  cart,
}) {
  const tableStyle = `width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;`;
  const thStyle = `background-color: #f2f2f2;
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
  text-align:center;`;
  const tdStyle = `padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
  text-align:center;`;

  const imageId = require("crypto").randomBytes(10).toString("hex");
  const logoPath = path.join(__dirname, "..", "assets", "header_logo.png");

  const mailOptions = {
    from: process.env.EMAIL_AUTH_USER,
    to: targetEmail,
    subject: "Receipt",
    html: `
    <!DOCTYPE html>
    <html lang="he">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <style>
    
  </style>
  
    <body>
        <div style="font-family: Helvetica,Arial,sans-serif;line-height:2; direction: rtl;">
            <div style="margin:50px auto;padding:20px 0; max-width: 500px;">
                <div
                    style="border-bottom:1px solid #eee; background-color: #00B8D4; text-align: center; padding-top: .5rem;">
                    <img src="cid:${imageId}" alt="PASS logo"
                        style="object-fit: cover; width: 10rem; height: 4rem; margin: 0 auto;">
                </div>
                <p>תודה שבחרת להשתמש בשירותי PASS.
               
                <h1>קבלה לרכישתך</h1>
  <p>שם החנות: ${merchantId}</p>
  <p>תאריך: ${transactionDate}</p>
  <p>שעה: ${transactionTime}</p>
  <p>סוג כרטיס: ${cardType}</p>
  <p>ספרות אחרונות: ${last4}</p>
  <p>מספר עסקה: ${transactionId}</p>
  <table style="${tableStyle}">

    <thead>
      <tr>
        <th style="${thStyle}">פריט</th>
        <th style="${thStyle}">כמות</th>
        <th style="${thStyle}">מחיר</th>
        <th style="${thStyle}">סה"כ</th>
      </tr>
    </thead>

    <tbody>
      ${createCartTable(cart, tdStyle)}
    </tbody>

    <tfoot>
      <tr>
        <td style="${tdStyle}" colspan="3">סה"כ לתשלום</td>
        <td style="${tdStyle}">${amount} ש"ח</td>
      </tr>
    </tfoot>
  </table>
  <h2>פרטי המשלם</h2>
  <p>שם: ${firstName} ${lastName}</p>
  <p>אימייל: ${email}</p>
  <h2>צור קשר</h2>
  <p>passproject@hotmail.com<p>
     <hr style="border:none;border-top:1px solid #eee" />
      </div>
</div>
   </div>
    </body>
    </html>
  `,
    attachments: [
      {
        cid: imageId,
        filename: "header_logo.png",
        path: logoPath,
      },
    ],
  };

  try {
    const browser = await puppeteer.launch({ headless: true });

    const page = await browser.newPage();

    const html = mailOptions.html;

    const imageBase64 = fs.readFileSync(logoPath, { encoding: "base64" });
    const htmlWithImage = html.replace(
      `cid:${imageId}`,
      `data:image/png;base64,${imageBase64}`
    );
    await page.setContent(htmlWithImage, { waitUntil: "networkidle2" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      path: "test.pdf",
    });

    mailOptions.attachments.push({
      filename: "receipt.pdf",
      content: pdfBuffer,
    });

    await mailer.sendMail(mailOptions);
    await browser.close();

    console.log("Receipt sent successfully");
  } catch (err) {
    throw new Error("Error while sending email was occurred");
  }
}

module.exports = sendReceiptEmail;
