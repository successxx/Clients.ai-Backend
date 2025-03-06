import { Request, ResponseToolkit } from "@hapi/hapi";
import { failureResponse, successResponse } from "../utils/apiResponse";
import sequelize from "../config/db";
import { AddCompanyPayload, ICompanyDetails } from "../interfaces/ICompany";
import { getTokenFromHeader, readJwtClaims } from "../utils/jwtUtil";
import { IJwt } from "../interfaces/IJwt";
import { BaseError, Op } from "sequelize";
import { paginate, paginateResponse } from "../utils/paginationUtil";
import { callChatCompletionsAPI } from "../services/aiService";
import { getCompanyDetailsFromWebsitePrompt } from "../prompts/getCompanyDetailsFromWebsitePrompt";
import User from "../models/User";
import CompanyDetail from "../models/CompanyDetail";
import CompanyOffer from "../models/CompanyOffer";
import { getCompanyDetailsFallbackPrompt } from "../prompts/getCompanyDetailsFallbackPrompt";
import WebscanCampaign from "../models/webScanCampaign";
import { createTypeform, createTypeformWebhook } from "../utils/fileHandler";
import WebscanOffer from "../models/webScanOffer";

const { chromium } = require("playwright-chromium");

export const getCompanyDetails = async (
  request: Request,
  h: ResponseToolkit
) => {
  const { id } = request.params;
  const token = getTokenFromHeader(request);
  const claims = readJwtClaims(token) as IJwt;
  const userId = claims.id;

  try {
    const company = await CompanyDetail.findOne({
      where: {
        id: id,
        userId: userId,
      },
      include: [
        {
          model: CompanyOffer,
        },
      ],
    });

    if (!company) {
      return h.response(failureResponse("Company not found")).code(404);
    }

    const sanitizedOffers = company.offers.map((offer) => ({
      offerName: offer.offerName ?? "",
      price: offer.price ?? "",
      offerTopic: offer.offerTopic ?? "",
      offerDescription: offer.offerDescription ?? "",
      primaryBenefits: offer.primaryBenefits ?? "",
      offerGoal: offer.offerGoal ?? "",
      targetActionURL: offer.targetActionURL ?? "",
    }));

    const responseData = {
      ...company.toJSON(),
      offers: sanitizedOffers,
    };

    return h
      .response(successResponse(responseData, "Company fetched successfully"))
      .code(200);
  } catch (error) {
    return h
      .response(failureResponse("Error fetching company details"))
      .code(500);
  }
};

export const addCompanyDetails = async (
  request: Request,
  h: ResponseToolkit
) => {
  const payload = request.payload as AddCompanyPayload;
  const transaction = await sequelize.transaction();

  try {
    const { companyDetails, offers, website, userId } = payload;

    const user = await User.findByPk(userId);
    if (!user) {
      await transaction.rollback();
      return h.response(failureResponse("Invalid user ID")).code(400);
    }

    const wasOnboarded = user.isOnboarded;

    const createdCompany = await CompanyDetail.create(
      { ...companyDetails, website, userId: Number(userId) },
      { transaction }
    );
    createdCompany.isPrimary = true;
    await createdCompany.save({ transaction });

    if (!wasOnboarded) {
      const newCampaign = await WebscanCampaign.create(
        {
          campaignName: "Webscan Campaign",
          testimonial: companyDetails.testimonials,
          companyId: createdCompany.id,
        },
        { transaction }
      );

      const typeformResponse = await createTypeform(
        "Webscan Campaign",
        newCampaign.id
      );
      const typeformFormId = typeformResponse.id;
      const typeformEmbedUrl = typeformResponse._links.display;

      await createTypeformWebhook(typeformFormId);

      const embedHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Build Your Quiz to Unlock Personalized Marketing</title>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700&display=swap" rel="stylesheet">
      <style>
      body, html {
      margin: 0;
      padding: 0;
      font-family: 'Montserrat', sans-serif;
      background-color: transparent;
      min-height: 100vh;
      }
      .outer-container {
      width: 100%;
      max-width: 800px;
      margin: 20px auto;
      background-color: transparent;
      position: relative;
      }
      .inner-container {
      background-color: white;
      border-radius: 15px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .header {
      background-color: #252525;
      color: white;
      padding: 20px;
      font-size: 24px;
      font-weight: 700;
      text-align: center;
      width: 100%;
      box-sizing: border-box;
      }
      .content {
      height: 500px;
      }
      .content > div {
      height: 100%; 
      }
      .footer {
      position: absolute;
      bottom: -40px;
      right: 0;
      }
      .clients-button {
      display: inline-block;
      background-color: #252525;
      color: white;
      font-size: 12px;
      padding: 5px 10px;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 400;
      }
      </style>
      </head>
      <body>
      <div class="outer-container">
      <div class="inner-container">
      <div class="header">
      Claim Your Free Gift Now
      </div>
      <div class="content">
      <div data-tf-widget="${typeformFormId}" style="width: 100%; height: 100%;"></div>
      </div>
      </div>
      <div class="footer">
      <a href="https://clients.ai/" class="clients-button" target="_blank">ClientsAI Enabled</a>
      </div>
      </div>
      <script src="https://embed.typeform.com/next/embed.js"></script>
      </body>
      </html>
  `;

      newCampaign.typeFormId = typeformFormId;
      newCampaign.typeFormEmbeddedLink = typeformEmbedUrl;
      newCampaign.htmlEmbeddedCode = embedHtml;
      await newCampaign.save({ transaction });

      const webscanOfferData = offers.map((offer) => ({
        ...offer,
        campaignId: newCampaign.id,
      }));
      await WebscanOffer.bulkCreate(webscanOfferData, { transaction });
    }

    for (const offer of offers) {
      await CompanyOffer.create(
        { ...offer, companyId: createdCompany.id },
        { transaction }
      );
    }

    await User.update(
      { isOnboarded: true },
      { where: { id: userId }, transaction }
    );

    const companyWithDetails = await CompanyDetail.findOne({
      where: { id: createdCompany.id },
      include: [{ model: CompanyOffer }],
      transaction,
    });

    await transaction.commit();

    return h
      .response(successResponse(companyWithDetails, "Company details added"))
      .code(200);
  } catch (err: any) {
    await transaction.rollback();

    const errors = err?.errors as BaseError[] | undefined;
    if (errors) {
      err.message = `Type: ${err?.name}, ${errors
        .map((x) => x.message)
        .join(", ")}`;
    }
    return h.response(failureResponse(err.message)).code(500);
  }
};

export const getPrimaryCompanyDetails = async (
  request: Request,
  h: ResponseToolkit
) => {
  const transaction = await sequelize.transaction();
  const token = getTokenFromHeader(request);
  const claims = readJwtClaims(token) as IJwt;
  const userId = claims.id;

  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const primaryCompany = await CompanyDetail.findOne({
      where: { userId, isPrimary: true },
      include: [CompanyOffer],
      transaction,
    });

    if (!primaryCompany) {
      await transaction.rollback();
      return h
        .response({ success: false, message: "Primary company not found" })
        .code(404);
    }

    const responseData = {
      companyDetails: {
        id: primaryCompany.id,
        companyName: primaryCompany.companyName,
        industry: primaryCompany.industry,
        primaryProductsOrServices: primaryCompany.primaryProductsOrServices,
        companyDescription: primaryCompany.companyDescription,
        primaryGoal: primaryCompany.primaryGoal,
        targetAudience: primaryCompany.targetAudience,
        primaryCustomerPainPoints: primaryCompany.primaryCustomerPainPoints,
        testimonials: primaryCompany.testimonials,
        offers: primaryCompany.offers.map((offer) => ({
          offerName: offer.offerName,
          offerTopic: offer.offerTopic,
          price: offer.price,
          offerDescription: offer.offerDescription,
          offerGoal: offer.offerGoal,
          primaryBenefits: offer.primaryBenefits,
          targetActionURL: offer.targetActionURL,
        })),
      },
    };

    await transaction.commit();

    return h.response({ success: true, data: responseData }).code(200);
  } catch (err: any) {
    await transaction.rollback();
    console.error("Error fetching primary company:", err);
    return h
      .response({
        success: false,
        message: err.message || "Internal server error",
      })
      .code(500);
  }
};

export const updateCompanyDetails = async (
  request: Request,
  h: ResponseToolkit
) => {
  const { id } = request.params;
  const payload = request.payload as ICompanyDetails;
  const transaction = await sequelize.transaction();
  const token = getTokenFromHeader(request);
  const claims = readJwtClaims(token) as IJwt;
  const userId = claims.id;

  try {
    const company = await CompanyDetail.findByPk(id);

    if (!company) {
      return h.response({ message: "Company not found" }).code(404);
    }
    if (company.userId !== userId) {
      return h.response(failureResponse("Unauthorized")).code(401);
    }

    if (payload.isPrimary !== undefined && payload.isPrimary) {
      const existingPrimaryCompany = await CompanyDetail.findOne({
        where: { userId: userId, isPrimary: true },
      });
      await existingPrimaryCompany?.update({ isPrimary: false, transaction });
    }

    await company.update(payload, { transaction });

    payload.offers![0].companyId = company.id;
    const companyOffer = await CompanyOffer.findOne({
      where: { companyId: company.id },
    });
    await companyOffer?.update(payload.offers![0] as any, { transaction });
    await transaction.commit();
    return h
      .response(successResponse("", "Company details updated successfully"))
      .code(200);
  } catch (err: any) {
    await transaction.rollback();
    const errors = err?.errors as BaseError[];
    if (errors) {
      err.message = `Type: ${err?.name},  ${
        errors && errors.map((x) => x.message).join(", ")
      }`;
    }
    return err;
  }
};

export const selectAsPrimary = async (request: Request, h: ResponseToolkit) => {
  const { id } = request.payload as { id: number };
  const token = getTokenFromHeader(request);
  const claims = readJwtClaims(token) as IJwt;
  const userId = claims.id;
  try {
    const company = await CompanyDetail.findOne({
      where: { userId: userId, id: id },
    });

    const primaryCompany = await CompanyDetail.findOne({
      where: { userId: userId, isPrimary: true },
    });

    if (!primaryCompany) {
      return h.response({ message: "Company not found" }).code(404);
    }

    await primaryCompany.update({ isPrimary: false });

    if (!company) {
      return h.response({ message: "Company not found" }).code(404);
    }

    await company.update({ isPrimary: true });

    return h.response(successResponse("", "Primary company updated")).code(200);
  } catch (err: any) {
    const errors = err?.errors as BaseError[];
    if (errors) {
      err.message = `Type: ${err?.name},  ${
        errors && errors.map((x) => x.message).join(", ")
      }`;
    }
    return err;
  }
};
export const companyList = async (request: Request, h: ResponseToolkit) => {
  const { page = 1, pageSize = 10, search } = request.query;
  const token = getTokenFromHeader(request);
  const claims = readJwtClaims(token) as IJwt;
  const userId = claims.id;

  try {
    const { limit, offset } = paginate(Number(page), Number(pageSize));

    const whereClause: any = { userId: Number(userId) };
    if (search) whereClause.companyName = { [Op.like]: `%${search}%` };

    const { rows, count } = await CompanyDetail.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: CompanyOffer,
        },
      ],
      limit,
      offset,
    });
    const sanitizedCompanies = rows.map((company) => {
      const sanitizedOffers = company.offers.map((offer) => ({
        offerName: offer.offerName ?? "",
        price: offer.price ?? "",
        offerTopic: offer.offerTopic ?? "",
        offerDescription: offer.offerDescription ?? "",
        primaryBenefits: offer.primaryBenefits ?? "",
        offerGoal: offer.offerGoal ?? "",
        targetActionURL: offer.targetActionURL ?? "",
      }));

      return {
        ...company.toJSON(),
        offers: sanitizedOffers,
      };
    });

    const response = paginateResponse(
      sanitizedCompanies,
      count,
      Number(page),
      Number(pageSize)
    );

    return h
      .response(successResponse(response, "Company list fetched successfully"))
      .code(200);
  } catch (err: any) {
    const errors = err?.errors as BaseError[];
    if (errors) {
      err.message = `Type: ${err?.name},  ${
        errors && errors.map((x) => x.message).join(", ")
      }`;
    }
    console.error("Error fetching company list:", err.message || err);
    return h.response(failureResponse("Error fetching company list")).code(500);
  }
};

export const offerList = async (request: Request, h: ResponseToolkit) => {
  console.log("this is the request query", request.query);
  const { page = 1, pageSize = 10, search } = request.query;
  const token = getTokenFromHeader(request);
  const claims = readJwtClaims(token) as IJwt;
  const userId = claims.id;

  try {
    const { limit, offset } = paginate(Number(page), Number(pageSize));

    // Step 1: Fetch all company IDs associated with the userId
    const companyDetails = await CompanyDetail.findAll({
      where: { userId },
      attributes: ["id", "companyName"],
    });

    if (!companyDetails || companyDetails.length === 0) {
      return h
        .response(failureResponse("No companies found for the user."))
        .code(404);
    }

    const companyIds = companyDetails.map((company) => company.id);

    // Step 2: Construct the where clause to fetch offers for all companyIds
    const whereClause: any = {
      companyId: {
        [Op.in]: companyIds,
      },
    };

    if (search) {
      whereClause["offerName"] = {
        [Op.like]: `%${search}%`,
      };
    }

    // Step 3: Fetch offers for all companyIds
    const { rows, count } = await CompanyOffer.findAndCountAll({
      where: whereClause,
      limit,
      offset,
    });

    const sanitizedOffers = rows.map((offer) => {
      const companyDetail = companyDetails.find(
        (company) => company.id === offer.companyId
      );
      return {
        offerName: offer.offerName || "",
        price: offer.price || "",
        offerTopic: offer.offerTopic || "",
        offerDescription: offer.offerDescription || "",
        primaryBenefits: offer.primaryBenefits || "",
        offerGoal: offer.offerGoal || "",
        targetActionURL: offer.targetActionURL || "",
        companyName: companyDetail?.companyName || "",
        companyId: companyDetail?.id || "",
      };
    });

    const response = paginateResponse(
      sanitizedOffers,
      count,
      Number(page),
      Number(pageSize)
    );

    return h
      .response(successResponse(response, "Offer list fetched successfully"))
      .code(200);
  } catch (err: any) {
    console.error("Error fetching offers list:", err.message || err);
    return h.response(failureResponse("Error fetching offers list")).code(500);
  }
};

export const getOfferDetails = async (request: Request, h: ResponseToolkit) => {
  const { companyId } = request.query; // Get companyId from query parameters

  if (!companyId) {
    return h.response(failureResponse("companyId is required")).code(400);
  }

  const token = getTokenFromHeader(request);
  const claims = readJwtClaims(token) as IJwt;
  const userId = claims.id;

  try {
    const companyDetail = await CompanyDetail.findOne({
      where: { id: companyId, userId },
      attributes: ["id", "companyName"],
    });

    if (!companyDetail) {
      return h
        .response(
          failureResponse("No access to this company or company not found")
        )
        .code(403);
    }

    const offer = await CompanyOffer.findOne({
      where: { companyId },
      order: [["createdAt", "ASC"]],
    });

    if (!offer) {
      return h
        .response(failureResponse("No offers found for this company"))
        .code(404);
    }

    const offerDetails = {
      offerName: offer.offerName || "",
      price: offer.price || "",
      offerTopic: offer.offerTopic || "",
      offerDescription: offer.offerDescription || "",
      primaryBenefits: offer.primaryBenefits || "",
      offerGoal: offer.offerGoal || "",
      targetActionURL: offer.targetActionURL || "",
    };

    return h
      .response(
        successResponse(offerDetails, "Offer details fetched successfully")
      )
      .code(200);
  } catch (err: any) {
    console.error("Error fetching offer details:", err.message || err);
    return h
      .response(failureResponse("Error fetching offer details"))
      .code(500);
  }
};

export const updateOfferDetails = async (
  request: Request,
  h: ResponseToolkit
) => {
  const { companyId } = request.query;
  const payload: any = request.payload;

  if (!companyId) {
    return h.response(failureResponse("companyId is required")).code(400);
  }

  const token = getTokenFromHeader(request);
  const claims = readJwtClaims(token) as IJwt;
  const userId = claims.id;

  try {
    // Step 1: Validate company access
    const companyDetail = await CompanyDetail.findOne({
      where: { id: companyId, userId },
      attributes: ["id", "companyName"],
    });

    if (!companyDetail) {
      return h
        .response(
          failureResponse("No access to this company or company not found")
        )
        .code(403);
    }

    const offer = await CompanyOffer.findOne({
      where: { companyId },
    });

    if (!offer) {
      return h
        .response(failureResponse("No offer found for this company"))
        .code(404);
    }

    await offer.update(payload);

    return h
      .response(successResponse(null, "Offer updated successfully"))
      .code(200);
  } catch (err: any) {
    console.error("Error updating offer details:", err.message || err);
    return h
      .response(failureResponse("Error updating offer details"))
      .code(500);
  }
};

export const addNewCompany = async (request: Request, h: ResponseToolkit) => {
  const payload = request.payload as Partial<ICompanyDetails>;
  const transaction = await sequelize.transaction({ logging: console.log });

  const token = getTokenFromHeader(request);
  const claims = readJwtClaims(token) as IJwt;
  const userId = claims.id;

  try {
    const { offers, ...rest } = payload;

    if (payload.isPrimary !== undefined && payload.isPrimary) {
      const existingPrimaryCompany = await CompanyDetail.findOne({
        where: { userId: userId, isPrimary: true },
        transaction,
      });

      if (existingPrimaryCompany) {
        existingPrimaryCompany.isPrimary = false;
        await existingPrimaryCompany.save({ transaction });
      }
    }
    const companyDetails = await CompanyDetail.create(rest, { transaction });

    if (offers && offers.length > 0) {
      offers[0].companyId = companyDetails.id;
      await CompanyOffer.create(offers[0] as any, {
        transaction,
      });
    } else {
      console.log("No Offers provided in the payload");
    }

    await transaction.commit();

    return h
      .response(
        successResponse(companyDetails.id, "Company added successfully!")
      )
      .code(200);
  } catch (err: any) {
    await transaction.rollback();
    console.error("Transaction rolled back due to error:", err);

    const errors = err?.errors as BaseError[];
    if (errors) {
      err.message = `Type: ${err?.name}, ${errors
        .map((x) => x.message)
        .join(", ")}`;
      console.error("Formatted Error Message:", err.message);
    }

    return h
      .response({ message: err.message || "Error adding company" })
      .code(500);
  }
};

export const scrapeCompanyDetails = async (
  request: Request,
  h: ResponseToolkit
) => {
  try {
    const payload = request.query as { companyWebsite: string };

    const browser = await chromium.launch({
      headless: true,
      args: ["--disable-blink-features=AutomationControlled"],
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    page.setDefaultNavigationTimeout(60000); // Increase timeout

    await page.goto(payload.companyWebsite, {
      waitUntil: "domcontentloaded", // Less strict than "networkidle"
      timeout: 60000,
    });

    const completeHTML = await page.content();

    // Close the browser
    await browser.close();

    const systemPrompt =
      "You are a master of text extraction, inference, text analysis, as well as as a master of psychoanalysis and inference, taking the viewpoint of Carl Jung.";
    const userPrompt = getCompanyDetailsFromWebsitePrompt(
      payload.companyWebsite,
      completeHTML
    );
    let companyData: any;
    try {
      companyData = await callChatCompletionsAPI(systemPrompt, userPrompt);
    } catch (error) {
      const fallbackUserPrompt = getCompanyDetailsFallbackPrompt(
        payload.companyWebsite
      );
      companyData = await callChatCompletionsAPI(
        systemPrompt,
        fallbackUserPrompt
      );
    }
    console.log("companyData", companyData);
    // const testimonials = companyData.companyDetails.testimonials[0];
    // delete companyData.companyDetails.testimonials;

    // companyData.companyDescription.testimonials = testimonials;

    companyData.companyDetails.targetAudience =
      companyData.companyDetails.targetAudience.paragraph1 +
      "</br>" +
      companyData.companyDetails.targetAudience.paragraph2 +
      "</br>" +
      companyData.companyDetails.targetAudience.paragraph3;

    companyData.companyDetails.primaryCustomerPainPoints =
      companyData.companyDetails.primaryCustomerPainPoints.paragraph1 +
      "</br>" +
      companyData.companyDetails.primaryCustomerPainPoints.paragraph2 +
      "</br>" +
      companyData.companyDetails.primaryCustomerPainPoints.paragraph3;

    return h
      .response(successResponse({ companyDetails: companyData.companyDetails }))
      .code(200);
  } catch (err: any) {
    const errors = err?.errors as BaseError[];
    if (errors) {
      err.message = `Type: ${err?.name}, ${errors
        .map((x) => x.message)
        .join(", ")}`;
      console.error("Formatted Error Message:", err.message);
    }

    return h
      .response({ message: err.message || "Error adding company" })
      .code(500);
  }
};
