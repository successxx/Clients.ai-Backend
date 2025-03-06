import * as brevo from "@getbrevo/brevo";
import CompanySMTPConfig from "../models/CompanySMTPConfig";
import nodemailer from "nodemailer";
import { EMAIL, EMAIL_OPTIONS, SENDGRID_API_KEY } from "../constants";
import axios from "axios";
import { MailDataRequired } from "@sendgrid/mail";
const sendgrid = require("@sendgrid/mail");

// export const sendEmailFromService = async (
//   mailOptions: brevo.SendSmtpEmail,
//   companyId: number | null = null
// ) => {
//   try {
//     let smtpConfig = null;

//     if (companyId && companyId !== 0)  {
//       smtpConfig = await CompanySMTPConfig.findOne({
//         where: { companyId },
//       });
//     }

//     if (!smtpConfig) {

//       smtpConfig = {
//         smtpHost: process.env.SMTP_HOST as string,
//         smtpPort: parseInt(process.env.SMTP_PORT || "587"),
//         smtpUser: process.env.SMTP_USER as string,
//         smtpPassword: process.env.SMTP_PASSWORD as string,
//         useSSL: process.env.SMTP_SSL === "true",
//       };
//     }

//     const transporter = new brevo.TransactionalEmailsApi();
//     transporter.setApiKey(0, smtpConfig.smtpPassword);

//     mailOptions.sender = {
//       name: "Prognostic.ai",
//       email: smtpConfig.smtpUser,
//     };

//     const data = await transporter.sendTransacEmail(mailOptions);
//     return data;
//   } catch (error: any) {
//     console.error("Error sending email:", error);
//     return { error: true, message: "Email sending failed: " + error.message };
//   }
// };
sendgrid.setApiKey(SENDGRID_API_KEY);

export const sendEmailFromService = async (mailOptions: any) => {
  try {
    // const transporter = nodemailer.createTransport({
    //   host: EMAIL.HOST,
    //   port: EMAIL.PORT,
    //   secure: true,
    //   auth: {
    //     user: EMAIL.SMTP_USER,
    //     pass: EMAIL.SMTP_PASSWORD,
    //   },
    // });

    // Prepare email options
    const emailOptions: MailDataRequired = {
      to: [
        {
          email: mailOptions.to[0].email,
        },
      ],
      from: {
        email: EMAIL_OPTIONS.FROM,
        name: EMAIL_OPTIONS.FROM_NAME,
      },
      subject: mailOptions.subject,
      content: [
        {
          value: mailOptions.htmlContent,
          type: "text/html",
        },
      ],
    };

    // const emailOptions = {
    //   channel: "prognostic",
    //   recipients: {
    //     to: [
    //       {
    //         name: mailOptions.to[0].name,
    //         address: mailOptions.to[0].email,
    //       },
    //     ],
    //   },
    //   originator: {
    //     from: {
    //       name: "Clients.ai",
    //       address: EMAIL_OPTIONS.FROM,
    //     },
    //   },
    //   subject: mailOptions.subject,
    //   body: {
    //     parts: [
    //       {
    //         content: mailOptions.htmlContent,
    //         type: "text/html",
    //       },
    //     ],
    //   },
    // };

    // Send the email using SendGrid
    const response = await sendgrid.send(emailOptions);
    console.log("Email sent successfully");

    const info = await response[0].statusCode;
    console.log("Email sent: ", info);
    return { success: true };
  } catch (error: any) {
    console.error("Email sending error:", error.response.body.errors);
    return { error: true, message: "Failed to send email: " + error.message };
  }
};

// export const sendEmailFromService = async (mailOptions: any) => {
//   try {
//     let BREVO_API_KEY = process.env.BREVO_API_KEY as string;
//     let apiInstances = new brevo.AccountApi();

//     apiInstances.setApiKey(brevo.AccountApiApiKeys.apiKey, BREVO_API_KEY);
//     const apiInstance = new brevo.TransactionalEmailsApi();
//     apiInstance.setApiKey(0, BREVO_API_KEY);

//     const data = await apiInstance.sendTransacEmail(mailOptions);
//     console.log(
//       "API called successfully. Returned data: " + JSON.stringify(data)
//     );
//     return data;
//   } catch (error: any) {
//     console.error(error);
//     return { error: true, message: "Email sending failed: " + error.message };
//   }
// };
