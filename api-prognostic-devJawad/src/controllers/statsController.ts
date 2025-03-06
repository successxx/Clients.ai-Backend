import { Request, ResponseToolkit } from "@hapi/hapi";
import QuizSubmission from "../models/quizSubmissions";
import WebscanSubmission from "../models/webScanSubmission";
import { successResponse } from "../utils/apiResponse";
import { getTokenFromHeader, readJwtClaims } from "../utils/jwtUtil";
import { IJwt } from "../interfaces/IJwt";
import CompanyDetail from "../models/CompanyDetail";
import { col, fn, QueryTypes, Sequelize } from "sequelize";
import { Op } from "sequelize";
import WebscanCampaign from "../models/webScanCampaign";
import QuizCampaign from "../models/quizCampaigns";
import sequelize from "../config/db";

export const getTotalCampaignLeads = async (
  request: Request,
  h: ResponseToolkit
) => {
  try {
    const query = request.query as { campaignId: number };
    const webscanLeads = await WebscanSubmission.count({
      where: { webscanCampaignId: query.campaignId },
    });

    const quizLeads = await QuizSubmission.count({
      where: { quizCampaignId: query.campaignId },
    });
    const totalLeads = webscanLeads + quizLeads;
    return h.response(successResponse(totalLeads)).code(200);
  } catch (error: any) {
    return h.response({ message: "Error: " + error.message }).code(500);
  }
};

export const getHomePageData = async (request: Request, h: ResponseToolkit) => {
  try {
    const { companyId } = request.query; // Extract from query params

    if (!companyId) {
      return h.response({ message: "Company ID is required" }).code(400);
    }

    // Get active campaigns count
    const [webscanActiveCount, quizActiveCount] = await Promise.all([
      WebscanCampaign.count({ where: { status: true, companyId } }),
      QuizCampaign.count({ where: { status: true, companyId } }),
    ]);
    const totalActiveCampaigns = webscanActiveCount + quizActiveCount;

    // Get total leads count
    const [totalWebscanLeads, totalQuizLeads] = await Promise.all([
      WebscanSubmission.count({ where: { companyId } }),
      QuizSubmission.count({ where: { companyId } }),
    ]);
    const totalLeads = totalWebscanLeads + totalQuizLeads;

    // Get daily stats (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const currentYear = new Date().getFullYear();

    const webscanCounts = await WebscanSubmission.findAll({
      attributes: [
        [fn("MONTH", col("createdAt")), "month"],
        [fn("COUNT", col("id")), "count"],
      ],
      where: sequelize.where(fn("YEAR", col("createdAt")), currentYear),
      group: ["month"],
    });

    const quizCounts = await QuizSubmission.findAll({
      attributes: [
        [fn("MONTH", col("createdAt")), "month"],
        [fn("COUNT", col("id")), "count"],
      ],
      where: sequelize.where(fn("YEAR", col("createdAt")), currentYear),
      group: ["month"],
    });

    const combinedMap = new Map<number, number>();

    for (const record of webscanCounts) {
      const month = record.getDataValue("month") as number;
      const count = Number(record.getDataValue("count"));
      combinedMap.set(month, (combinedMap.get(month) || 0) + count);
    }

    for (const record of quizCounts) {
      const month = record.getDataValue("month") as number;
      const count = Number(record.getDataValue("count"));
      combinedMap.set(month, (combinedMap.get(month) || 0) + count);
    }

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const monthlyStats = [];
    for (let i = 1; i <= 12; i++) {
      monthlyStats.push({
        name: monthNames[i - 1],
        leads: combinedMap.get(i) || 0,
      });
    }

    const webscanDailyCounts = await WebscanSubmission.findAll({
      attributes: [
        [fn("DAYNAME", col("createdAt")), "day"],
        [fn("COUNT", col("id")), "count"],
      ],
      where: {
        createdAt: { [Op.gte]: sevenDaysAgo },
        companyId,
      },
      group: ["day"],
    });

    const quizDailyCounts = await QuizSubmission.findAll({
      attributes: [
        [fn("DAYNAME", col("createdAt")), "day"],
        [fn("COUNT", col("id")), "count"],
      ],
      where: {
        createdAt: { [Op.gte]: sevenDaysAgo },
        companyId,
      },
      group: ["day"],
    });

    const dailyMap = new Map<string, number>();

    for (const record of webscanDailyCounts) {
      const day = record.getDataValue("day");
      const count = Number(record.getDataValue("count"));
      dailyMap.set(day, (dailyMap.get(day) || 0) + count);
    }

    for (const record of quizDailyCounts) {
      const day = record.getDataValue("day");
      const count = Number(record.getDataValue("count"));
      dailyMap.set(day, (dailyMap.get(day) || 0) + count);
    }

    const weekDays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dailyStats = weekDays.map((day) => ({
      name: day.substring(0, 3),
      leads: dailyMap.get(day) || 0,
    }));

    return h.response({
      activeCampaigns: totalActiveCampaigns,
      leads: {
        totalLeads,
        dailyStats,
      },
      salesAnalysis: {
        year: currentYear,
        monthlyStats: monthlyStats
      }
    }).code(200);
  } catch (error) {
    console.error("Error fetching campaign leads:", error);
    return h.response({ message: "An unexpected error occurred" }).code(500);
  }
};

export const getTotalAndDailyLeads = async (
  request: Request,
  h: ResponseToolkit
) => {
  try {
    const token = getTokenFromHeader(request);
    const claims = readJwtClaims(token) as IJwt;
    const userId = claims.id;

    const company = await CompanyDetail.findOne({
      where: {
        userId: userId,
      },
    });

    if (!company) {
      return h.response({ message: "Company not found" }).code(404);
    }

    // Get total leads count
    const webscanLeads = await WebscanSubmission.count({
      where: {
        companyId: company.id,
      },
    });

    const quizLeads = await QuizSubmission.count({
      where: {
        companyId: company.id,
      },
    });

    const totalLeads = webscanLeads + quizLeads;

    // Get daily lead counts (Monday to Sunday)
    // Define all days of the week (ensuring correct order)
    const weekDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    // Fetch WebscanSubmission lead counts
    const dailyLeads = await WebscanSubmission.findAll({
      attributes: [
        [Sequelize.fn("DAYNAME", Sequelize.col("createdAt")), "dayName"],
        [Sequelize.fn("COUNT", Sequelize.col("*")), "leadCount"],
      ],
      where: {
        companyId: company.id,
        createdAt: {
          [Op.gte]: Sequelize.literal("CURDATE() - INTERVAL 7 DAY"),
        },
      },
      group: ["dayName"],
    });

    // Fetch QuizSubmission lead counts
    const quizDailyLeads = await QuizSubmission.findAll({
      attributes: [
        [Sequelize.fn("DAYNAME", Sequelize.col("createdAt")), "dayName"],
        [Sequelize.fn("COUNT", Sequelize.col("*")), "leadCount"],
      ],
      where: {
        companyId: company.id,
        createdAt: {
          [Op.gte]: Sequelize.literal("CURDATE() - INTERVAL 7 DAY"),
        },
      },
      group: ["dayName"],
    });

    // Convert Sequelize result to object with { dayName: count }
    const dailyLeadCounts = Object.fromEntries(
      dailyLeads.map((lead) => [lead.get("dayName"), lead.get("leadCount")])
    );

    const quizDailyLeadCounts = Object.fromEntries(
      quizDailyLeads.map((lead) => [lead.get("dayName"), lead.get("leadCount")])
    );

    // Merge with the full week template, ensuring all days exist
    const totalDailyLeadCounts = weekDays.map((day) => ({
      dayName: day,
      totalLeads: (dailyLeadCounts[day] || 0) + (quizDailyLeadCounts[day] || 0),
    }));

    return h
      .response(successResponse({ totalLeads, totalDailyLeadCounts }))
      .code(200);
  } catch (error: any) {
    return h.response({ message: "Error: " + error.message }).code(500);
  }
};
