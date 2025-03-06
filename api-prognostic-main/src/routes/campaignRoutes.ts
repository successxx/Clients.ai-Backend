import { ServerRoute } from "@hapi/hapi";
import {
  addCampaign,
  filterCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
} from "../controllers/campaignController";
import {
  campaignIdSchema,
  campaignQuerySchema,
  campaignSchema,
} from "../validators/campaignValidator";

export const CampaignRoutes: ServerRoute[] = [
  {
    method: "POST",
    path: "/create",
    handler: addCampaign,
    options: {
      auth: {
        strategy: "jwt",
        scope: ["user"],
      },
      validate: {
        payload: campaignSchema,
      },
    },
  },
  {
    method: "GET",
    path: "/list",
    handler: filterCampaigns,
    options: {
      auth: {
        strategy: "jwt",
        scope: ["user"],
      },
      validate: {
        query: campaignQuerySchema,
      },
      description: "Get list of campaigns",
    },
  },
  {
    method: "GET",
    path: "/detail/{id}",
    handler: getCampaignById,
    options: {
      auth: {
        strategy: "jwt",
        scope: ["user"],
      },
      validate: {
        params: campaignIdSchema,
      },
    },
  },
  {
    method: "PUT",
    path: "/{id}",
    handler: updateCampaign,
    options: {
      auth: {
        strategy: "jwt",
        scope: ["user"],
      },
      validate: {
        params: campaignIdSchema,
        payload: campaignSchema,
      },
    },
  },
  {
    method: "DELETE",
    path: "/{id}",
    handler: deleteCampaign,
    options: {
      auth: {
        strategy: "jwt",
        scope: ["user"],
      },
      validate: {
        params: campaignIdSchema,
      },
    },
  },
];
