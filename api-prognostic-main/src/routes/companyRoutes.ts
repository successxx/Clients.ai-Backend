import { ServerRoute } from "@hapi/hapi";
import {
  addCompanyDetails,
  // getCompanyDetailsBySubDomain,
  updateCompanyDetails,
  getCompanyDetails,
  selectAsPrimary,
  companyList,
  addNewCompany,
} from "../controllers/companyController";
import {
  companyDetailsSchema,
  companyListSchema,
  selectAsPrimaryValidator,
  updateCompanyDetailsSchema,
} from "../validators/companyDetailsValidator";
import dotenv from "dotenv";

dotenv.config();

const DOMAIN_NAME = process.env.DOMAIN_NAME || "no domain configured in env";

export const CompanyRoutes: ServerRoute[] = [
  {
    method: "POST",
    path: "/addCompanyDetails",
    options: {
      auth: false,
      validate: {
        payload: companyDetailsSchema,
      },
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
];
