import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    logger: true,
    debug: true,
    secureConnection: false,
    auth: {
      user: process.env.SENDER_MAIL,
      pass: process.env.SMTP_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });

export default transporter;