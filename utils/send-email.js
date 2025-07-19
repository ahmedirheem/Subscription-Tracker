import dayjs from "dayjs";

import { emailTemplates } from "./email-templets.js";
import transporter, { emailAccount } from "../config/nodemailer.js";

export const sendReminderEmail = async ({ to, type, subscription }) => {
  if (!to || !type) throw new Error("Missing required parameters");

  const template = emailTemplates.find((t) => t.label === type);

  if (!template) throw new Error("Invalid email type");

  const mainInfo = {
    userName: subscription.user.name,
    subscriptionName: subscription.name,
    renewalDate: dayjs(subscription.renewalDate).format("MMM D, YYYY"),
    planName: subscription.name,
    price: `${subscription.currency} ${subscription.price} ${subscription.frequency}`,
    paymentMethod: subscription.paymentMethod,
  };

  const message = template.generateBody(mainInfo);
  const subject = template.generateSubject(mainInfo);

  const mailOptions = {
    from: emailAccount,
    to,
    subject,
    html: message,
  };

  // transporter.sendMail(mailOptions, (error, info) => {
  //   if (error) return console.log(error, 'Error sending email');

  //   console.log('Email Sent: ' + info.response);
  // })

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};
