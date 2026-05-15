const SibApiV3Sdk = require("sib-api-v3-sdk");

const client = SibApiV3Sdk.ApiClient.instance;

client.authentications["api-key"].apiKey =
  process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const sendOTP = async (to, otp) => {

  return await apiInstance.sendTransacEmail({

    sender: {
      email: "phantringuyen432@gmail.com",
      name: "SHOP"
    },

    to: [
      {
        email: to
      }
    ],

    subject: "Mã OTP xác thực",

    textContent: `Mã OTP của bạn là: ${otp}`

  });

};

module.exports = sendOTP;