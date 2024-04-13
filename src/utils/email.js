const {Resend} = require("resend");
require("dotenv").config();

const EMAIL_API_KEY = process.env.EMAIL_API_KEY;
const resend = new Resend(EMAIL_API_KEY);

const sendWelcomeEmail = (email, name) => {
  resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "WelCome to E-Learning",
    html: `<p>Hello<strong>${name}</strong> welcome to E-Learning!</p>`,
  });
};

module.exports = {
  sendWelcomeEmail,
};
