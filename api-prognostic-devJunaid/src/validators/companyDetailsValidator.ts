import Joi from "joi";

export const testimonialSchema = Joi.object({
  content: Joi.string().required(),
  attribution: Joi.string().optional().allow(""),
});

export const companyOfferSchema = Joi.object({
  offerName: Joi.string().required(),
  price: Joi.string().optional().allow(""),
  offerDescription: Joi.string().required(),
  primaryBenefits: Joi.string().required(),
  targetActionURL: Joi.string().required(),
  offerGoal: Joi.string().required(),
});

export const companyDetailsSchema = Joi.object({
  companyName: Joi.string().required(),
  industry: Joi.string().required(),
  primaryProductsOrServices: Joi.string().required(),
  companyDescription: Joi.string().required(),
  primaryGoal: Joi.string().required(),
  targetAudience: Joi.string().required(),
  primaryCustomerPainPoints: Joi.string().required(),
  userId: Joi.number().required(),
  offers: Joi.array().items(
    Joi.object({
      offerName: Joi.string().required(),
      price: Joi.string().optional(),
      offerDescription: Joi.string().required(),
      primaryBenefits: Joi.string().required(),
      targetActionURL: Joi.string().uri().required(),
      offerGoal: Joi.string().required(),
      offerTopic: Joi.string().required(),
    })
  ),
  testimonials: Joi.string().required(),
  isPrimary: Joi.boolean().optional(),
});

export const updateCompanyDetailsSchema = Joi.object({
  companyName: Joi.string().required(),
  industry: Joi.string().required(),
  primaryProductsOrServices: Joi.string().required(),
  companyDescription: Joi.string().required(),
  primaryGoal: Joi.string().required(),
  targetAudience: Joi.string().required(),
  primaryCustomerPainPoints: Joi.string().required(),
  userId: Joi.number().required(),
  offers: Joi.array().items(
    Joi.object({
      offerName: Joi.string().required(),
      price: Joi.string().optional(),
      offerDescription: Joi.string().required(),
      primaryBenefits: Joi.string().required(),
      targetActionURL: Joi.string().uri().required(),
      offerGoal: Joi.string().required(),
      offerTopic: Joi.string().required(),
    })
  ),
  testimonials: Joi.string().required(),
  isPrimary: Joi.boolean().optional(),
});

export const selectAsPrimaryValidator = Joi.object({
  id: Joi.number().required(),
});

export const reducedCompanyDetailsSchema = companyDetailsSchema.fork(
  ["offers", "userId"], // Fields to modify
  (schema) => schema.forbidden() // Mark them as forbidden
);

export const getOfferDetailsValidator = Joi.object({
  companyId: Joi.string().required().description("ID of the company"),
});

export const companyListSchema = Joi.object({
  page: Joi.number().min(1).default(1),
  pageSize: Joi.number().min(1).default(10),
  search: Joi.string().allow("").optional(),
});

export const companyOfferListSchema = Joi.object({
  page: Joi.number().min(1).default(1),
  pageSize: Joi.number().min(1).default(10),
  search: Joi.string().allow("").optional(),
});

export const updateOfferPayloadValidator = Joi.object({
  offerName: Joi.string().optional(),
  price: Joi.string().optional(),
  offerTopic: Joi.string().optional(),
  offerDescription: Joi.string().optional(),
  primaryBenefits: Joi.string().optional(),
  offerGoal: Joi.string().optional(),
  targetActionURL: Joi.string().optional().uri().description("A valid URL"),
});

export const companyWebsiteQuerySchema = Joi.object({
  companyWebsite: Joi.string().uri().required(),
});
