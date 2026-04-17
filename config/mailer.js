const { text } = require("express");
require("dotenv").config();
const nodemailer=require("nodemailer");

const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL,
        pass:process.env.PASSWORD,
    },
});

const sendWelcomeMail = async (to, otp)=>{
   
    try {
        const mailOptions={
            from:process.env.EMAIL,
            to:to,
            subject:"Welcome to Shortly",
            text:"Hi there, welcome to Shortly!",
             html: `
             <h2>Congratulations 🎉</h2>
        <p>Your account has been created successfully.</p>

        <h2>This is your OTP for email verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
      `
        };
         const info = await transporter.sendMail(mailOptions);
         
         //console.log("Email sent successfully:", info);

    } catch (error) {
       console.log("Error sending mail:", error);
    }
};

const sendResetPassword = async (email, link) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Reset Your Password",
      html: `
        <h2>Password Reset</h2>
        <p>Click below link to reset your password:</p>
        <a href="${link}">${link}</a>
      `
    };

    await transporter.sendMail(mailOptions);

  } catch (error) {
    console.log("Error:", error);
  }
};
module.exports = { sendWelcomeMail, sendResetPassword };