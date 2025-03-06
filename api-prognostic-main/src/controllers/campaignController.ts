import { Request, ResponseToolkit } from "@hapi/hapi";
import { BaseError, Op, Transaction } from "sequelize";
import Campaign from "../models/Campaign";
import { ICampaign } from "../interfaces/ICampaign";
import { paginateResponse, paginate } from "../utils/paginationUtil";
import { getTokenFromHeader, readJwtClaims } from "../utils/jwtUtil";
import { IJwt } from "../interfaces/IJwt";
import CompanyDetail from "../models/CompanyDetail";
import CompanyOffer from "../models/CompanyOffer";
import sequelize from "../config/db";
import User from "../models/User";
import { generateQuizHooks } from "../services/quizHookService";
import Anthropic from "@anthropic-ai/sdk";

export const addCampaign = async (request: Request, h: ResponseToolkit) => {
  const transaction = await sequelize.transaction();
  try {
    const payload = request.payload as Partial<ICampaign>;
    const companyId = payload.companyId ?? null;
    const token = getTokenFromHeader(request);
    const claims = readJwtClaims(token) as IJwt;
    const userId = claims.id;
    payload.userId = userId;

    if (companyId) {
      const company = await CompanyDetail.findOne({
        where: {
          userId: userId,
          id: companyId,
        },
      });

      if (!company) {
        return h.response({ message: "Company not found" }).code(404);
      }
      payload.companyId = company.id;
      company.update(payload.companyDetails as any);
      const companyOffer = await CompanyOffer.findOne({
        where: { companyId: company.id },
      });
      await companyOffer?.update(payload.offers![0] as any, { transaction });
    } else {
      payload.companyDetails!.userId = userId;
      const company = await CompanyDetail.create(
        payload.companyDetails as any,
        { transaction }
      );
      payload.companyId = company.id;
      payload.offers![0].companyId = company.id;
      const companyOffer = await CompanyOffer.create(
        payload.offers![0] as any,
        { transaction }
      );
    }
    const campaign = await Campaign.create(payload, { transaction });
    await transaction.commit();

    const user = await User.findByPk(userId);
    await generateQuizHooks(user!, payload);
    return h.response(campaign).code(201);
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

export const filterCampaigns = async (request: Request, h: ResponseToolkit) => {
  const { page = 1, pageSize = 10, type, status, search } = request.query;
  const companyId = request.headers.companyid;

  if (!companyId) {
    return h
      .response({ message: "Company ID is missing in the request" })
      .code(400);
  }

  try {
    const { limit, offset } = paginate(Number(page), Number(pageSize));

    const whereClause: any = { companyId: Number(companyId) };
    if (type) whereClause.type = type;
    if (status) whereClause.status = status;
    if (search) whereClause.campaignName = { [Op.like]: `%${search}%` };

    const { rows, count } = await Campaign.findAndCountAll({
      where: whereClause,
      limit,
      offset,
    });

    const response = paginateResponse(
      rows,
      count,
      Number(page),
      Number(pageSize)
    );
    return h.response(response).code(200);
  } catch (error) {
    console.error(error);
    return h.response({ message: "Error filtering campaigns" }).code(500);
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

export const updateCampaign = async (request: Request, h: ResponseToolkit) => {
  const { id } = request.params;
  const payload = request.payload as Partial<ICampaign>;
  const companyId = request.headers.companyid;

  if (!companyId) {
    return h
      .response({ message: "Company ID is missing in the request" })
      .code(400);
  }

  try {
    const campaign = await Campaign.findOne({
      where: { id, companyId: Number(companyId) },
    });

    if (!campaign) {
      return h.response({ message: "Campaign not found" }).code(404);
    }

    await campaign.update(payload);
    return h.response({ message: "Campaign updated successfully" }).code(200);
  } catch (error) {
    console.error(error);
    return h.response({ message: "Error updating campaign" }).code(500);
  }
};

export const deleteCampaign = async (request: Request, h: ResponseToolkit) => {
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
    });

    if (!campaign) {
      return h.response({ message: "Campaign not found" }).code(404);
    }

    await campaign.destroy();
    return h.response({ message: "Campaign deleted successfully" }).code(200);
  } catch (error) {
    console.error(error);
    return h.response({ message: "Error deleting campaign" }).code(500);
  }
};
