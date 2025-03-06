import { ServerRoute } from "@hapi/hapi";
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  importLeadsFromCSV,
} from "../controllers/leadController";
import { leadSchema, leadIdSchema, leadQuerySchema } from "../validators/leadValidator";

export const LeadRoutes: ServerRoute[] = [
  {
    method: "POST",
    path: "/leads",
    handler: createLead,
    options: {
      auth: "jwt",
      validate: {
        payload: leadSchema,
      },
    },
  },
  {
    method: "GET",
    path: "/leads",
    handler: getLeads,
    options: {
      auth: {
        strategies: ["jwt"],
        access: [{ scope: ["user"] }],
      },
      validate: {
        query: leadQuerySchema,
      },
    },
  },
  {
    method: "GET",
    path: "/leads/{id}",
    handler: getLeadById,
    options: {
      auth: "jwt",
      validate: {
        params: leadIdSchema,
      },
    },
  },
  {
    method: "PUT",
    path: "/leads/{id}",
    handler: updateLead,
    options: {
      auth: "jwt",
      validate: {
        params: leadIdSchema,
        payload: leadSchema,
      },
    },
  },
  {
    method: "DELETE",
    path: "/leads/{id}",
    handler: deleteLead,
    options: {
      auth: "jwt",
      validate: {
        params: leadIdSchema,
      },
    },
  },
  {
    method: 'POST',
    path: '/leads/import',
    options: {
      payload: {
        output: 'data',
        parse: true,
        multipart: true,
        maxBytes: 20 * 1024 * 1024, // 20MB limit
      },
    },
    handler: importLeadsFromCSV,
  }
];
