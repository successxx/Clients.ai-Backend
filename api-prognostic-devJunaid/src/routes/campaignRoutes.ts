import { ServerRoute } from "@hapi/hapi";
import {
  addCampaign,
  createQuizCampaignWithTypeForm,
  fetchCampaignEmails,
  fetchFormSubmissions,
  getCampaignById,
  getCampaigns,
  // getWebscanCampaigns,
  // updateCampaign,
  // deleteCampaign,
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
    handler: createQuizCampaignWithTypeForm,
    options: {
      auth: {
        strategy: "jwt",
        scope: ["user"],
      },
      // validate: {
      //   payload: campaignSchema,
      // },
      tags: ["authRequired"], // Apply middleware to this route
    },
  },
  {
    method: "GET",
    path: "/list",
    handler: getCampaigns,
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
    path: "/{id}",
    handler: fetchFormSubmissions,
    options: {
      auth: {
        strategy: "jwt",
        scope: ["user"],
      },
      // validate: {
      //   query: campaignQuerySchema,
      // },
      description: "Get list of form submissions for a campaign",
    },
  },
  {
    method: "GET",
    path: "/emails/{id}",
    handler: fetchCampaignEmails,
    options: {
      auth: {
        strategy: "jwt",
        scope: ["user"],
      },
      description: "Get list of Campaign Emails",
    },
  },
  // {
  //   method: "GET",
  //   path: "webscan/list",
  //   handler: getWebscanCampaigns,
  //   options: {
  //     auth: {
  //       strategy: "jwt",
  //       scope: ["user"],
  //     },
  //     // validate: {
  //     //   query: campaignQuerySchema,
  //     // },
  //     description: "Get list of Webscan campaigns",
  //   },
  // },
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
  // {
  //   method: "PUT",
  //   path: "/{id}",
  //   handler: updateCampaign,
  //   options: {
  //     auth: {
  //       strategy: "jwt",
  //       scope: ["user"],
  //     },
  //     validate: {
  //       params: campaignIdSchema,
  //       payload: campaignSchema,
  //     },
  //   },
  // },
  // {
  //   method: "DELETE",
  //   path: "/{id}",
  //   handler: deleteCampaign,
  //   options: {
  //     auth: {
  //       strategy: "jwt",
  //       scope: ["user"],
  //     },
  //     validate: {
  //       params: campaignIdSchema,
  //     },
  //   },
  // },
];
