const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({

  host: "smtp-relay.brevo.com",

  port: 587,

  secure: false,

  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }

});

transporter.verify((err) => {

  if (err) {
    console.log("MAIL ERROR:", err);
  } else {
    console.log("MAIL READY");
  }

});

module.exports = transporter;