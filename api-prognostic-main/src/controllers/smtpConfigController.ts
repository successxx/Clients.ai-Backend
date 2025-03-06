import { Request, ResponseToolkit } from "@hapi/hapi";
import CompanySMTPConfig from "../models/CompanySMTPConfig";
import { ICompanySMTPConfig } from "../interfaces/ICompanySMTPConfig";
import { log } from "console";

export const addSMTPConfig = async (request: Request, h: ResponseToolkit) => {
    try {
      const companyId = request.headers.companyid;
    console.log(companyId, '== companyId ==');

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

export const updateSMTPConfig = async (request: Request, h: ResponseToolkit) => {
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
    return h.response({ message: "SMTP config updated successfully" }).code(200);
  } catch (error) {
    console.error("Error updating SMTP config:", error);
    return h.response({ message: "Error updating SMTP config" }).code(500);
  }
};
