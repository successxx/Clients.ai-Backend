import * as brevo from "@getbrevo/brevo";
import CompanySMTPConfig from "../models/CompanySMTPConfig";



export const sendEmailFromService = async (
  mailOptions: brevo.SendSmtpEmail,
  companyId: number | null = null
) => {
  try {
    let smtpConfig = null;

    if (companyId && companyId !== 0)  {
      smtpConfig = await CompanySMTPConfig.findOne({
        where: { companyId },
      });
    }

    if (!smtpConfig) {

      smtpConfig = {
        smtpHost: process.env.SMTP_HOST as string,
        smtpPort: parseInt(process.env.SMTP_PORT || "587"),
        smtpUser: process.env.SMTP_USER as string,
        smtpPassword: process.env.SMTP_PASSWORD as string,
        useSSL: process.env.SMTP_SSL === "true",
      };
    }

    const transporter = new brevo.TransactionalEmailsApi();
    transporter.setApiKey(0, smtpConfig.smtpPassword);

    mailOptions.sender = {
      name: "Prognostic.ai",
      email: smtpConfig.smtpUser,
    };

    const data = await transporter.sendTransacEmail(mailOptions);
    return data;
  } catch (error: any) {
    console.error("Error sending email:", error);
    return { error: true, message: "Email sending failed: " + error.message };
  }
};
