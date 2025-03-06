// jobs/chargeLeadsJob.ts
import cron from "node-cron";
import CompanyDetail from "../models/CompanyDetail";
import QuizSubmission from "../models/quizSubmissions";
import WebscanSubmission from "../models/webScanSubmission";
import { calculateCharge, chargeCompany } from "../utils/stripeUtils";

cron.schedule("0 0 * * *", async () => {
  try {
    // Get all companies
    const companies = await CompanyDetail.findAll();
    console.log("charge leads charge");
    for (const company of companies) {
      // Get leads for this company that haven't been charged
      const webscanLeads = await WebscanSubmission.findAll({
        where: {
          companyId: company.id,
          isCharged: false,
        },
      });

      // Get leads for this company that haven't been charged
      const quizLeads = await QuizSubmission.findAll({
        where: {
          companyId: company.id,
          isCharged: false,
        },
      });

      // Calculate charge based on lead count
      const chargeAmount = calculateCharge(
        webscanLeads.length + quizLeads.length
      );

      if (chargeAmount > 0) {
        // Charge the company via Stripe
        await chargeCompany(company.id, chargeAmount);

        // Mark leads as charged
        await WebscanSubmission.update(
          { isCharged: true },
          { where: { companyId: company.id, isCharged: false } }
        );

        await QuizSubmission.update(
          { isCharged: true },
          { where: { companyId: company.id, isCharged: false } }
        );
      }
    }
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});
