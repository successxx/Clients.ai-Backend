import { ServerRoute } from "@hapi/hapi";
import {
  addCompanyDetails,
  // getCompanyDetailsBySubDomain,
  updateCompanyDetails,
  getCompanyDetails,
  selectAsPrimary,
  companyList,
  addNewCompany,
  offerList,
  getOfferDetails,
  updateOfferDetails,
  getPrimaryCompanyDetails,
  scrapeCompanyDetails,
} from "../controllers/companyController";
import {
  companyDetailsSchema,
  companyListSchema,
  companyOfferListSchema,
  companyWebsiteQuerySchema,
  getOfferDetailsValidator,
  selectAsPrimaryValidator,
  updateCompanyDetailsSchema,
  updateOfferPayloadValidator,
} from "../validators/companyDetailsValidator";
import dotenv from "dotenv";
import { getOfferDetailsQueryValidator } from "src/validators/offerValidator";

dotenv.config();

const DOMAIN_NAME = process.env.DOMAIN_NAME || "no domain configured in env";

export const CompanyRoutes: ServerRoute[] = [
  {
    method: "POST",
    path: "/addCompanyDetails",
    options: {
      auth: false,
      // validate: {
      //   payload: companyDetailsSchema,
      // },
    },
    handler: addCompanyDetails,
  },

  // {
  //   method: 'GET',
  //   path: '/{subdomain}',
  //   handler: getCompanyDetailsBySubDomain,
  //   options: {
  //     description: 'Get company details by subdomain',
  //     tags: ['api', 'company'],
  //   },
  // },

  {
    method: "GET",
    path: "/detail/{id}",
    handler: getCompanyDetails,
    options: {
      description: "Get company details by ID",
      tags: ["api", "company"],
      validate: {
        params: selectAsPrimaryValidator,
      },
    },
  },

  {
    method: "GET",
    path: "/primaryCompany",
    handler: getPrimaryCompanyDetails,
    options: {
      description: "Get primary company details by user ID",
      tags: ["api", "company"],
    },
  },

  {
    method: "PUT",
    path: "/update/{id}",
    handler: updateCompanyDetails,
    options: {
      validate: {
        payload: updateCompanyDetailsSchema,
      },
      description: "Update company details by ID",
      tags: ["api", "company"],
    },
  },
  {
    method: "POST",
    path: "/selectAsPrimary",
    handler: selectAsPrimary,
    options: {
      validate: {
        payload: selectAsPrimaryValidator,
      },
    },
  },
  {
    method: "GET",
    path: "/list",
    handler: companyList,
    options: {
      validate: {
        query: companyListSchema,
      },
    },
  },
  {
    method: "GET",
    path: "/offer/list",
    handler: offerList,
    options: {
      validate: {
        query: companyOfferListSchema,
      },
    },
  },
  {
    method: "GET",
    path: "/offer/detail",
    handler: getOfferDetails,
    options: {
      validate: {
        query: getOfferDetailsValidator,
      },
    },
  },
  {
    method: "PUT",
    path: "/offer/update",
    handler: updateOfferDetails,
    options: {
      validate: {
        query: getOfferDetailsValidator,
        payload: updateOfferPayloadValidator,
      },
    },
  },
  {
    method: "POST",
    path: "/addNewCompany",
    options: {
      auth: false,
      validate: {
        payload: companyDetailsSchema,
      },
    },
    handler: addNewCompany,
  },
  {
    method: "GET",
    path: "/scrapeCompanyDetails",
    options: {
      auth: false,
      validate: {
        query: companyWebsiteQuerySchema,
      },
      tags: ["authRequired"], // Apply middleware to this route
    },
    handler: scrapeCompanyDetails,
  },
];
