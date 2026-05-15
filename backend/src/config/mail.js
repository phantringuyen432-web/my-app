const nodemailer = require("nodemailer");

console.log("MAIL FILE LOADED");

const transporter = nodemailer.createTransport({

  host: "smtp-relay.brevo.com",

  port: 587,

  secure: false,

  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }

});

transporter.verify(function (error, success) {

  if (error) {

    console.log("MAIL ERROR:", error);

  } else {

    console.log("MAIL READY");

  }

});

module.exports = transporter;