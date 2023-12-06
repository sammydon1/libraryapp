import nodemailer from "nodemailer";

export function sendRecoveryEmail(email, password) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
  // Send emails to users
  let message = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Recovery Email ",
    html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
      <div style="margin:0px auto;width:70%;padding:20px 0">
        <div style="border-bottom:1px solid #eee">
          <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">My Library</a>
        </div>
        <p style="font-size:1.1em">Hi,</p>
        <p>Thank you for choosing My Library app. Your password has been changed successfully.To secure your account, please login with the below password and reset later</p>
        <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${password}</h2>
        <p style="font-size:0.9em;">Regards,<br />My library</p>
        <hr style="border:none;border-top:1px solid #eee" />
        <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
          <p>My Library Inc</p>
          <p>Winpey Junction Opp Perperoni</p>
          <p>PortHarcourt, Nigeria</p>
        </div>
      </div>
    </div>`,
  };
  transporter
    .sendMail(message)
    .then((success) =>
      console.log(" password reset successfully and email sent to " + email)
    )
    .catch((error) => console.log(error));
}
