const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "phantringuyen432@gmail.com",
    pass: "skmj ehcu dtod fksi"
  }
});

module.exports = transporter;