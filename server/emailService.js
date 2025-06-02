const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // অথবা SMTP সার্ভার
    auth: {
      user: process.env.EMAIL_USER, // আপনার ইমেইল
      pass: process.env.EMAIL_PASS, // ইমেইলের পাসওয়ার্ড বা অ্যাপ পাসওয়ার্ড
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: text,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = sendEmail;
