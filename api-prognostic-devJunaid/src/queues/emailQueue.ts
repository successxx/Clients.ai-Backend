import Queue, { DoneCallback, Job } from "bull";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { EMAIL, SENDGRID_API_KEY } from "../constants";
import { sendEmailFromService } from "../services/emailService";
import { IEmailData } from "../interfaces/emailData";
import axios from "axios";
import WebScanCampaignEmail from "../models/WebScanCampaignEmail";
import { MailDataRequired } from "@sendgrid/mail";
const sendgrid = require("@sendgrid/mail");

dotenv.config();
sendgrid.setApiKey(SENDGRID_API_KEY);

const emailQueue = new Queue("emailQueue", {
  redis: {
    host: "prognostic.redis.cache.windows.net", // Replace with Azure Redis hostname
    port: 6380, // Default Redis port
    password: "8ICnzh53fOAfCpskcwlTuhWsPReZnnoYWAzCaC0llqQ=", // Replace with Azure Redis access key
    tls: { rejectUnauthorized: false }, // Ensure TLS works correctly for Azure Redis
    maxRetriesPerRequest: null, // Disable retry limit
    enableReadyCheck: false, // Avoid readiness check failures
    connectTimeout: 10000,
  },
});

// Ensure queue is ready
emailQueue.on("error", (err) => {
  console.error("Redis Queue Error:", err);
});

emailQueue.on("waiting", (jobId) => {
  console.log(`Job ${jobId} is waiting to be processed.`);
});

emailQueue.on("active", (job, jobPromise) => {
  console.log(`Processing job ${job.id}...`);
});
emailQueue.process(async (job: Job, done: DoneCallback) => {
  try {
    const emailData = job.data as IEmailData;

    // Validate emailData
    if (!emailData) {
      throw new Error("Missing emailData in job");
    }

    if (!emailData.webscanSubmission || !emailData.webscanSubmission.email) {
      throw new Error("Missing webscanSubmission or recipient email");
    }

    if (
      !emailData.webscanSubmission.webscanCampaign ||
      !emailData.webscanSubmission.webscanCampaign.company
    ) {
      throw new Error("Missing company details");
    }

    // Prepare email options
    const emailOptions: MailDataRequired = {
      to: [
        {
          email: emailData.webscanSubmission.email,
        },
      ],
      from: {
        email: emailData.webscanSubmission.webscanCampaign.company.smtpEmail,
        name: emailData.webscanSubmission.webscanCampaign.company.companyName,
      },
      subject:
        emailData.emailSubject ||
        emailData.webscanSubmission.webscanCampaign.company.companyName,
      content: [
        {
          value: emailData.emailContent,
          type: "text/html",
        },
      ],
    };

    // Fetch the email record from the database
    const email = await WebScanCampaignEmail.findByPk(emailData.id);
    if (!email) {
      throw new Error(`Email record not found for ID: ${emailData.id}`);
    }

    console.log(`Sending email to: ${emailData.webscanSubmission.email}`);

    try {
      // Send the email using SendGrid
      await sendgrid.send(emailOptions);
      console.log("Email sent successfully");

      // Update the email status to "sent"
      await email.update({ status: "sent" });
      done(); // Mark the job as completed successfully
    } catch (sendError: any) {
      console.error("Error sending email:", sendError);

      // Log SendGrid error details if available
      if (sendError.response) {
        console.error("SendGrid error details:", sendError.response.body);
      }

      // Update the email record with the failure reason
      await email.update({
        failureReason: sendError.message,
      });

      // Mark the job as failed with the error
      done(new Error(`SMTP Error: ${sendError.message}`));
    }
  } catch (generalError: any) {
    console.error("Unexpected error in email queue:", generalError.message);

    // Mark the job as failed with the general error
    done(new Error(`Queue Processing Error: ${generalError.message}`));
  }
});

export default emailQueue;
