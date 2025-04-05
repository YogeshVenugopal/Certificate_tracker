import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    logger: true,
    debug: true,
    requireTLS: false,
    auth: {
      user: process.env.SENDER_MAIL,
      pass: process.env.SMTP_PASS
    }
  });

export default transporter;