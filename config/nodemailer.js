import nodemailer from "nodemailer";

import { EMAIL_PASSWORD } from "./env.js";

export const emailAccount = "ahmedirheem2003@gmail.com";

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: emailAccount,
    pass: EMAIL_PASSWORD,
  },
  // Add connection timeout settings
  connectionTimeout: 10000,
  socketTimeout: 10000
});

// Verify connection on startup
transporter.verify((error) => {
  if (error) {
    console.error('SMTP Connection Error:', error);
  } else {
    console.log('SMTP Connection Verified - Ready to send emails');
  }
});

export default transporter;