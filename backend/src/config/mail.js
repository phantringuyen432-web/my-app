const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({

  service: "gmail",

  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }

});

transporter.verify((err, success) => {

  if (err) {
    console.log("MAIL ERROR:", err);
  } else {
    console.log("MAIL READY");
  }

});
module.exports = transporter;