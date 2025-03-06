import { Request, ResponseToolkit } from "@hapi/hapi";
import { Op } from "sequelize";
import Campaign from "../models/Campaign";
import { IAddCampaignPayload, QuizPayload } from "../interfaces/ICampaign";
import { paginateResponse, paginate } from "../utils/paginationUtil";
import { getTokenFromHeader, readJwtClaims } from "../utils/jwtUtil";
import { IJwt } from "../interfaces/IJwt";
import CompanyDetail from "../models/CompanyDetail";
import CampaignDetailsRecord from "../models/CampaignDetailsRecord";
import sequelize from "../config/db";
import User from "../models/User";
import { generateQuizHooks } from "../services/quizHookService";
import WebscanCampaign from "../models/webScanCampaign";
import WebscanSubmission from "../models/webScanSubmission";
import WebScanCampaignEmail from "../models/WebScanCampaignEmail";
import {
  createTypeform,
  createTypeformWebhook,
  generateSerialCode,
} from "../utils/fileHandler";
import QuizCampaign from "../models/quizCampaigns";
import QuizOffer from "../models/quizOffer";

export const addCampaign = async (request: Request, h: ResponseToolkit) => {
  const payload = request.payload as IAddCampaignPayload;
  const transaction = await sequelize.transaction();
  const token = getTokenFromHeader(request);
  const claims = readJwtClaims(token) as IJwt;
  const userId = claims.id;
  try {
    const { companyDetails, offers, campaignDetails, optInDetails } = payload;
    const campaign = await Campaign.create(
      {
        ...campaignDetails,
        campaignName: campaignDetails.campaignName,
        userId: companyDetails.userId,
        type: campaignDetails.type,
      },
      { transaction }
    );

    await CampaignDetailsRecord.create(
      {
        campaignId: campaign.id,
        companyDetails: {
          companyName: companyDetails.companyName,
          industry: companyDetails.industry,
          primaryProductsOrServices: companyDetails.primaryProductsOrServices,
          companyDescription: companyDetails.companyDescription,
          primaryCustomerPainPoints: companyDetails.primaryCustomerPainPoints,
          primaryGoal: companyDetails.primaryGoal,
          testimonials: companyDetails.testimonials,
          targetAudience: companyDetails.targetAudience,
        },
        offerDetails: {
          offerName: offers[0]?.offerName,
          price: offers[0]?.price,
          offerDescription: offers[0]?.offerDescription,
          primaryBenefits: offers[0]?.primaryBenefits,
          targetActionURL: offers[0]?.targetActionURL,
          offerGoal: offers[0]?.offerGoal,
          offerTopic: offers[0]?.offerTopic,
        },
      },
      { transaction }
    );

    const user = await User.findByPk(userId);
    if (!user) {
      return h.response({ message: "User not found" }).code(404);
    }
    const quizHooks = await generateQuizHooks(user, payload);
    await transaction.commit();

    return h
      .response({
        message:
          "Campaign created successfully with company and offer details.",
        quizTitles: quizHooks.hooks,
        campaignData: {
          companyDetails,
          offers,
          campaignDetails: { campainId: campaign.id, ...campaignDetails },
        },
        success: true,
      })
      .code(200);
  } catch (err: any) {
    await transaction.rollback();
    console.error("Error creating campaign:", err);
    const errors = err?.errors || [];
    const errorMessage = `Type: ${err?.name}, ${errors
      .map((x: any) => x.message)
      .join(", ")}`;
    return h.response({ error: errorMessage }).code(500);
  }
};

export const createQuizCampaignWithTypeForm = async (
  request: Request,
  h: ResponseToolkit
) => {
  const transaction = await sequelize.transaction();

  try {
    const payload = request.payload as QuizPayload;
    const token = getTokenFromHeader(request);
    const claims = readJwtClaims(token) as IJwt;
    const userId = claims.id;
    const primaryCompany = await CompanyDetail.findOne({
      where: {
        userId: userId,
        isPrimary: true,
      },
      transaction,
    });

    if (!primaryCompany) {
      await transaction.rollback();
      return h
        .response({
          success: false,
          message: "No primary company found for the user.",
        })
        .code(404);
    }

    const companyId = primaryCompany.id;
    const serialCode = generateSerialCode();

    const newCampaign = await QuizCampaign.create(
      {
        campaignName: payload.campaignName,
        testimonial: payload.testimonial,
        companyId: companyId,
        serialCode: serialCode,
      },
      { transaction }
    );

    const offerData = payload.offers.map((offer) => ({
      ...offer,
      campaignId: newCampaign.id,
    }));
    await QuizOffer.bulkCreate(offerData, {
      transaction,
    });

    const user = await User.findByPk(userId);
    if (!user) {
      return h.response({ message: "User not found" }).code(404);
    }

    const quizHooks = await generateQuizHooks(user, payload);

    //     const typeformResponse = await createTypeform(
    //       payload.campaignName,
    //       newCampaign.id
    //     );

    //     const typeformFormId = typeformResponse.id;
    //     const typeformEmbedUrl = typeformResponse._links.display;

    //     //create webhook for typeform
    //     const typeformWebhookResponse = await createTypeformWebhook(typeformFormId);

    //     newCampaign.typeFormId = typeformFormId;
    //     newCampaign.typeFormEmbeddedLink = typeformEmbedUrl;
    //     await newCampaign.save({ transaction });

    //     const embedHtml = `
    //     <!DOCTYPE html>
    //     <html lang="en">
    //     <head>
    //     <meta charset="UTF-8">
    //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //     <title>Build Your Quiz to Unlock Personalized Marketing</title>
    //     <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700&display=swap" rel="stylesheet">
    //     <style>
    //     body, html {
    //     margin: 0;
    //     padding: 0;
    //     font-family: 'Montserrat', sans-serif;
    //     background-color: transparent;
    //     min-height: 100vh;
    //     }
    //     .outer-container {
    //     width: 100%;
    //     max-width: 800px;
    //     margin: 20px auto;
    //     background-color: transparent;
    //     position: relative;
    //     }
    //     .inner-container {
    //     background-color: white;
    //     border-radius: 15px;
    //     overflow: hidden;
    //     box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    //     }
    //     .header {
    //     background-color: #0142AC;
    //     color: white;
    //     padding: 20px;
    //     font-size: 24px;
    //     font-weight: 700;
    //     text-align: center;
    //     width: 100%;
    //     box-sizing: border-box;
    //     }
    //     .content {
    //     height: 500px;
    //     }
    //     .content > div {
    //     height: 100%;
    //     }
    //     .footer {
    //     position: absolute;
    //     bottom: -40px;
    //     right: 0;
    //     }
    //     .prognostic-button {
    //     display: inline-block;
    //     background-color: #0142AC;
    //     color: white;
    //     font-size: 12px;
    //     padding: 5px 10px;
    //     border-radius: 4px;
    //     text-decoration: none;
    //     font-weight: 400;
    //     }
    //     </style>
    //     </head>
    //     <body>
    //     <div class="outer-container">
    //     <div class="inner-container">
    //     <div class="header">
    //     Claim Your Free Gift Now
    //     </div>
    //     <div class="content">
    //     <div data-tf-widget="${typeformFormId}" style="width: 100%; height: 100%;"></div>
    //     </div>
    //     </div>
    //     <div class="footer">
    //     <a href="https://prognostic.ai/" class="prognostic-button" target="_blank">PrognosticAI Enabled</a>
    //     </div>
    //     </div>
    //     <script src="https://embed.typeform.com/next/embed.js"></script>
    //     </body>
    //     </html>
    // `;

    await transaction.commit();

    return h
      .response({
        message:
          "Campaign created successfully with company and offer details.",
        quizTitles: quizHooks.hooks,
        campaignData: {
          companyDetails: primaryCompany,
          offers: payload.offers,
          campaignDetails: { campainId: newCampaign.id, ...newCampaign },
        },
        success: true,
      })
      .code(200);
  } catch (error: any) {
    console.error("Error creating Quiz campaign and Typeform:", error);
    await transaction.rollback();
    return h
      .response({
        success: false,
        message: "Failed to create Quiz campaign and Typeform.",
        error: error.message,
      })
      .code(500);
  }
};

export const getCampaigns = async (request: Request, h: ResponseToolkit) => {
  const { page = 1, pageSize = 10, status, search, type } = request.query;
  const token = getTokenFromHeader(request);
  const claims = readJwtClaims(token) as IJwt;
  const userId = claims.id;

  try {
    const { limit, offset } = paginate(Number(page), Number(pageSize));

    let campaigns: any[] = []; 
    let count = 0;

    const company = await CompanyDetail.findOne({
      where: { userId, isPrimary: true },
    });

    if (!company) {
      return h
        .response({
          success: false,
          message: `No company found for userId: ${userId}`,
        })
        .code(404);
    }

    const companyId = company.id;

    if (type === "webscan") {      

      const { rows, count: totalCount } = await WebscanCampaign.findAndCountAll(
        {
          where: { companyId },
          limit,
          offset,
          order: [["createdAt", "DESC"]],
          include: [
            {
              association: "offers",
              attributes: ["id", "offerName", "price", "offerDescription"],
            },
          ],
        }
      );

      campaigns = rows || []; 
      count = totalCount || 0;
    } else if (type === "quiz") {
      const whereClause: any = { userId: Number(userId) };

      if (status) {
        whereClause.status = { [Op.eq]: status.toLowerCase() };
      }

      if (search) {
        whereClause.campaignName = { [Op.like]: `%${search}%` };
      }

      const { rows, count: totalCount } = await QuizCampaign.findAndCountAll({
        where: { companyId },
        limit,
        offset,
        order: [["createdAt", "DESC"]],
        include: [
          {
            association: "offers",
            attributes: ["id", "offerName", "price", "offerDescription"],
          },
        ],
      });

      campaigns = rows || [];
      count = totalCount || 0;
    }

    const response = paginateResponse(
      campaigns,
      count,
      Number(page),
      Number(pageSize)
    );

    return h
      .response({
        message: "Campaigns fetched successfully",
        success: true,
        data: response,
      })
      .code(200);
  } catch (error: any) {
    console.error("Error fetching campaigns:", error.message || error);
    return h
      .response({
        message: "Error fetching campaigns",
        success: false,
        error: error.message || "Internal server error",
      })
      .code(500);
  }
};

// export const fetchFormSubmissions = async (request: Request, h: ResponseToolkit) => {
//   const { id } = request.params;

//   try {
//     const campaign = await WebscanCampaign.findByPk(id);

//     if (!campaign) {
//       return h
//         .response({
//           success: false,
//           message: `No campaign found with ID: ${id}`,
//         })
//         .code(404);
//     }

//     if (!campaign.typeFormId) {
//       return h
//         .response({
//           success: false,
//           message: `No formId associated with campaign ID: ${id}`,
//         })
//         .code(404);
//     }

//     const formId = campaign.typeFormId;
//     console.log("formId", formId);

//     const submissions: { items: TypeformSubmission[] } = await fetchTypeformResponses(formId);

//     const formattedSubmissions = submissions.items.map((submission: TypeformSubmission) => {
//       const formattedAnswers: Record<string, string | undefined> = {};

//       submission.answers.forEach((answer: TypeformAnswer) => {
//         const fieldRef = answer.field.ref;
//         formattedAnswers[fieldRef] = answer.text || answer.email || answer.phone_number || "N/A";
//       });

//       return {
//         responseId: submission.response_id,
//         submittedAt: submission.submitted_at,
//         answers: formattedAnswers,
//       };
//     });

//     return h
//       .response({
//         success: true,
//         message: "Form submissions fetched successfully.",
//         data: formattedSubmissions,
//       })
//       .code(200);
//   } catch (error: any) {
//     console.error("Error fetching form submissions:", error.message);
//     return h
//       .response({
//         success: false,
//         message: "Failed to fetch form submissions.",
//         error: error.message,
//       })
//       .code(500);
//   }
// };

export const fetchFormSubmissions = async (
  request: Request,
  h: ResponseToolkit
) => {
  const { id } = request.params;

  try {
    const campaign = await WebscanCampaign.findByPk(id);

    if (!campaign) {
      return h
        .response({
          success: false,
          message: `No campaign found with ID: ${id}`,
        })
        .code(404);
    }

    const submissions = await WebscanSubmission.findAll({
      where: { webscanCampaignId: id },
    });

    if (submissions.length === 0) {
      return h
        .response({
          success: false,
          message: `No submissions found for campaign ID: ${id}`,
          totalLeads: 0, 
        })
        .code(404);
    }

    const formattedSubmissions = submissions.map((submission) => ({
      id: submission.id,
      firstName: submission.firstName,
      lastName: submission.lastName,
      email: submission.email,
      website: submission.website,
      submittedAt: submission.createdAt,
    }));

    const totalLeads = submissions.length;

    return h
      .response({
        success: true,
        message: "Form submissions fetched successfully.",
        totalLeads, 
        data: formattedSubmissions,
      })
      .code(200);
  } catch (error: any) {
    console.error("Error fetching form submissions:", error.message);
    return h
      .response({
        success: false,
        message: "Failed to fetch form submissions.",
        error: error.message,
        totalLeads: 0, // Default to 0 on error
      })
      .code(500);
  }
};


export const fetchCampaignEmails = async (
  request: Request,
  h: ResponseToolkit
) => {
  const { id } = request.params;

  try {
    const emails = await WebScanCampaignEmail.findAll({
      where: { webscanSubmissionId: id },
      limit: 9,
    });

    if (emails.length === 0) {
      return h
        .response({
          success: false,
          message: `No emails found for submission ID: ${id}`,
        })
        .code(404);
    }

    const formattedEmails = emails.map((email) => ({
      id: email.id,
      emailContent: email.emailContent,
      emailSubject: email.emailSubject || "N/A",
      recipientEmail: email.recipientEmail || "N/A",
      emailName: email.emailName || "N/A",
      submissionSerialCode: email.submissionSerialCode || "N/A",
      createdAt: email.createdAt,
    }));

    return h
      .response({
        success: true,
        message: "Emails fetched successfully.",
        data: formattedEmails,
      })
      .code(200);
  } catch (error: any) {
    console.error("Error fetching campaign emails:", error.message);
    return h
      .response({
        success: false,
        message: "Failed to fetch campaign emails.",
        error: error.message,
      })
      .code(500);
  }
};

export const getCampaignById = async (request: Request, h: ResponseToolkit) => {
  const { id } = request.params;
  const companyId = request.headers.companyid;

  if (!companyId) {
    return h
      .response({ message: "Company ID is missing in the request" })
      .code(400);
  }

  try {
    const campaign = await Campaign.findOne({
      where: { id, companyId: Number(companyId) },
      include: ["company", "user"],
    });

    if (!campaign) {
      return h.response({ message: "Campaign not found" }).code(404);
    }

    return h.response(campaign).code(200);
  } catch (error) {
    console.error(error);
    return h.response({ message: "Error fetching campaign" }).code(500);
  }
};

// export const getWebscanCampaigns = async (request: Request, h: ResponseToolkit) => {
//   const token = getTokenFromHeader(request);
//   const claims = readJwtClaims(token) as IJwt;
//   const userId = claims.id;
//   try {
//     const companies = await CompanyDetail.findAll({
//       where: { userId },
//       attributes: ["id"],
//     });

//     if (!companies || companies.length === 0) {
//       return h.response({
//         success: false,
//         message: `No companies found for userId: ${userId}`,
//       }).code(404);
//     }

//     const companyIds = companies.map((company) => company.id);

//     const campaigns = await WebscanCampaign.findAll({
//       where: {
//         companyId: companyIds,
//       },
//       include: [
//         {
//           association: "offers", // Include related offers
//           attributes: ["id", "offerName", "price"],
//         },
//       ],
//     });

//     if (!campaigns || campaigns.length === 0) {
//       return h.response({
//         success: false,
//         message: `No campaigns found for userId: ${userId}`,
//       }).code(404);
//     }

//     return h.response({
//       success: true,
//       message: "Webscan campaigns fetched successfully.",
//       data: campaigns,
//     }).code(200);
//   } catch (error: any) {
//     console.error("Error fetching Webscan campaigns:", error.message);
//     return h.response({
//       success: false,
//       message: "Failed to fetch Webscan campaigns.",
//       error: error.message,
//     }).code(500);
//   }
// };

// export const deleteCampaign = async (request: Request, h: ResponseToolkit) => {
//   const { id } = request.params;
//   const companyId = request.headers.companyid;

//   if (!companyId) {
//     return h
//       .response({ message: "Company ID is missing in the request" })
//       .code(400);
//   }

//   try {
//     const campaign = await Campaign.findOne({
//       where: { id, companyId: Number(companyId) },
//     });

//     if (!campaign) {
//       return h.response({ message: "Campaign not found" }).code(404);
//     }

//     await campaign.destroy();
//     return h.response({ message: "Campaign deleted successfully" }).code(200);
//   } catch (error) {
//     console.error(error);
//     return h.response({ message: "Error deleting campaign" }).code(500);
//   }
// };

// export const generateQuiz = async (request: Request, h: ResponseToolkit) => {
//   const { id } = request.params;
//   const token = getTokenFromHeader(request);
//   const claims = readJwtClaims(token) as IJwt;
//   const userId = claims.id;
