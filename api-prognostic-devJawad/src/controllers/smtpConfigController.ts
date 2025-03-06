import { Request, ResponseToolkit } from "@hapi/hapi";
import CompanySMTPConfig from "../models/CompanySMTPConfig";
import { ICompanySMTPConfig } from "../interfaces/ICompanySMTPConfig";
import CompanyDetail from "../models/CompanyDetail";
import { SENDGRID_API_KEY } from "../constants";
import User from "../models/User";

const client = require("@sendgrid/client");

client.setApiKey(SENDGRID_API_KEY);

export const addSMTPConfig = async (request: Request, h: ResponseToolkit) => {
  try {
    const companyId = request.headers.companyid;
    console.log(companyId, "== companyId ==");

    const payload = request.payload as Partial<ICompanySMTPConfig>;

    const smtpConfig = await CompanySMTPConfig.create({
      companyId: companyId,
      smtpHost: payload.smtpHost,
      smtpPort: payload.smtpPort,
      smtpUser: payload.smtpUser,
      smtpPassword: payload.smtpPassword,
      useSSL: payload.useSSL,
    });

    return h.response(smtpConfig).code(201);
  } catch (error) {
    console.error("Error adding SMTP config:", error);
    return h.response({ message: "Error adding SMTP config" }).code(500);
  }
};

export const getSMTPConfig = async (request: Request, h: ResponseToolkit) => {
  const { companyId } = request.params;

  try {
    const smtpConfig = await CompanySMTPConfig.findOne({
      where: { companyId },
    });

    if (!smtpConfig) {
      return h.response({ message: "SMTP config not found" }).code(404);
    }

    return h.response(smtpConfig).code(200);
  } catch (error) {
    console.error("Error fetching SMTP config:", error);
    return h.response({ message: "Error fetching SMTP config" }).code(500);
  }
};

export const updateSMTPConfig = async (
  request: Request,
  h: ResponseToolkit
) => {
  const { companyId } = request.params;
  const payload = request.payload as Partial<ICompanySMTPConfig>;

  try {
    const smtpConfig = await CompanySMTPConfig.findOne({
      where: { companyId },
    });

    if (!smtpConfig) {
      return h.response({ message: "SMTP config not found" }).code(404);
    }

    await smtpConfig.update(payload);
    return h
      .response({ message: "SMTP config updated successfully" })
      .code(200);
  } catch (error) {
    console.error("Error updating SMTP config:", error);
    return h.response({ message: "Error updating SMTP config" }).code(500);
  }
};

export const addOrUpdateSMTPEmail = async (
  request: Request,
  h: ResponseToolkit
) => {
  try {
    const { companyId } = request.params;
    const payload = request.payload as { smtpEmail: string };

    if (!companyId) {
      return h.response({ message: "Company ID is required" }).code(400);
    }

    const companyDetails = await CompanyDetail.findOne({
      where: { id: companyId },
    });

    if (!companyDetails) {
      return h.response({ message: "Company details not found" }).code(404);
    }
    const user = await User.findByPk(companyDetails.userId);
    if (!user) {
      return h.response({ message: "User not found" }).code(404);
    }
    const isNewEmail = !companyDetails.smtpEmail;

    await companyDetails.update({
      smtpEmail: payload.smtpEmail,
    });

    const data = {
      nickname: user?.name,
      from: {
        email: payload.smtpEmail,
        name: user.name,
      },
      reply_to: {
        email: payload.smtpEmail,
      },
      address: "Unit 3856 Box 3973\nDPO AA 31194",
      city: "New Matthew",
      country: "Myanmar",
    };

    const sendgridRequest = {
      url: `/v3/marketing/senders`,
      method: "POST",
      body: data,
    };

    try {
      const [response] = await client.request(sendgridRequest);
      console.log("sendgridResponse", response.statusCode);
    } catch (error) {
      return h.response({ message: error }).code(500);
    }

    return h
      .response({
        message: isNewEmail
          ? "SMTP Email successfully added"
          : "SMTP Email updated successfully",
      })
      .code(200);
  } catch (error) {
    console.error("Error adding/updating SMTP email:", error);
    return h.response({ message: "Error processing SMTP email" }).code(500);
  }
};

export const getSMTPEmail = async (request: Request, h: ResponseToolkit) => {
  try {
    const { companyId } = request.params;

    if (!companyId) {
      return h.response({ message: "Company ID is required" }).code(400);
    }

    const companyDetails = await CompanyDetail.findOne({
      where: { id: companyId },
      attributes: ["smtpEmail"],
    });

    if (!companyDetails) {
      return h.response({ message: "Company details not found" }).code(404);
    }

    return h
      .response({
        email: companyDetails.smtpEmail || null,
      })
      .code(200);
  } catch (error) {
    console.error("Error fetching SMTP email:", error);
    return h.response({ message: "Error fetching SMTP email" }).code(500);
  }
};
