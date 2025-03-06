import cron from "node-cron";
import { Op } from "sequelize";
import emailQueue from "../queues/emailQueue";
import WebScanCampaignEmail from "../models/WebScanCampaignEmail";
import WebscanSubmission from "../models/webScanSubmission";
import WebscanCampaign from "../models/webScanCampaign";
import CompanyDetail from "../models/CompanyDetail";
import User from "../models/User";

cron.schedule("* * * * *", async () => {
  try {
    console.log("🔍 Checking for scheduled emails...");

    const emailDataArray = await WebScanCampaignEmail.findAll({
      where: {
        sendDate: { [Op.lte]: new Date() },
        status: "pending",
      },
      attributes: ["emailSubject", "emailContent", "id"],
      include: [
        {
          model: WebscanSubmission,
          attributes: ["firstName", "email"],
          required: true, // Ensure only submissions that exist are included
          include: [
            {
              model: WebscanCampaign,
              attributes: ["id"], // Fetch at least 1 field to ensure join works
              required: true,
              include: [
                {
                  model: CompanyDetail,
                  attributes: ["companyName", "smtpEmail"], // Fetch company name
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    });

    async function addEmailsToQueue(emailDataArray: any) {
      try {
        for (const emailData of emailDataArray) {
          const job = await emailQueue.add(emailData);
          console.log(
            `Email queued for ${emailData.webscanSubmission.email} with Job ID: ${job.id}`
          );
        }
      } catch (error) {
        console.error("Error adding email to queue:", error);
      }
    }

    // Example usage
    await addEmailsToQueue(emailDataArray);
  } catch (error) {
    console.error("Error checking for scheduled emails:", error);
    throw error;
  }
});
