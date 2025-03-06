import { ServerRoute } from "@hapi/hapi";
import Joi from "joi";
import {
  getHomePageData,
  getTotalAndDailyLeads,
  getTotalCampaignLeads,
} from "../controllers/statsController";

export const StatsRoutes: ServerRoute[] = [
  {
    path: "/getTotalCampaignLeads",
    method: "GET",
    options: {
      validate: {
        query: Joi.object({
          campaignId: Joi.number().required(),
        }),
      },
      auth: false,
    },
    handler: getTotalCampaignLeads,
  },
  {
    path: "/getTotalAndDailyLeads",
    method: "GET",
    handler: getTotalAndDailyLeads,
  },
  {
    path: "/home-page",
    method: "GET",
    handler: getHomePageData,
  },
];
