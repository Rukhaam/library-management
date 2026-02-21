import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
  console.log("Using Email:", process.env.SMTP_MAIL);
    console.log("Password length:", process.env.SMTP_PASSWORD ? process.env.SMTP_PASSWORD.length : "UNDEFINED!");
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};