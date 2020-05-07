const nodemailer = require("nodemailer");

module.exports = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_EMAIL,
    to: options.email,
    subject: options.subject,
    text: options.text,
  });
};
