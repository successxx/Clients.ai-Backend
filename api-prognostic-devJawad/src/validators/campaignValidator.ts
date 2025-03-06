import Joi from "joi";
import {
  companyDetailsSchema,
  companyOfferSchema,
  reducedCompanyDetailsSchema,
} from "./companyDetailsValidator";

export const optInDetails = Joi.object({
  email: Joi.string().email().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  website: Joi.string().required(),
});

export const campaignSchema = Joi.object({
  campaignName: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  creationDate: Joi.date().required(),
  startTime: Joi.string().required(),
  endTime: Joi.string().required(),
  type: Joi.string().valid("web_scan", "quiz").optional(),
  status: Joi.string()
    .valid("Active", "Inactive", "Draft", "Completed")
    .default("Draft"),
  companyId: Joi.number().optional().allow(null),
  userId: Joi.number().optional(),
  companyDetails: reducedCompanyDetailsSchema.required(),
  offers: Joi.array().items(companyOfferSchema),
  optInDetails: optInDetails.optional(),
});

export const campaignQuerySchema = Joi.object({
  page: Joi.number().min(1).default(1),
  pageSize: Joi.number().min(1).default(10),
  type: Joi.string().valid("webscan", "quiz").optional(),
  status: Joi.string().valid("Active", "Inactive", "Draft", "Completed"),
  // search: Joi.string().allow("").optional(),
});

export const campaignIdSchema = Joi.object({
  id: Joi.number().required(),
});

export const updateCampaignSchema = Joi.object({
  campaignName: Joi.string().optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  startTime: Joi.string().optional(),
  endTime: Joi.string().optional(),
  type: Joi.string().valid("web_scan", "quiz").optional(),
  status: Joi.string()
    .valid("active", "inactive", "draft", "completed")
    .optional(),
  companyId: Joi.number().forbidden(),
  userId: Joi.number().forbidden(),
});
