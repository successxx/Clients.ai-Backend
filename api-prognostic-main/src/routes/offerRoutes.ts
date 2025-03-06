import { ServerRoute } from "@hapi/hapi";
import {
  getOfferDetailsQueryValidator,
  getOffersQueryValidator,
  offerSchema,
} from "../validators/offerValidator";
import {
  createOffer,
  getOfferDetails,
  getOfferList,
  updateOffer,
} from "../controllers/offerController";

export const OfferRoutes: ServerRoute[] = [
  {
    path: "/createOffer",
    method: "POST",
    options: {
      validate: {
        payload: offerSchema,
      },
    },
    handler: createOffer,
  },
  {
    path: "/getOfferList",
    method: "GET",
    options: {
      validate: {
        query: getOffersQueryValidator,
      },
    },
    handler: getOfferList,
  },
  {
    path: "/updateOffer",
    method: "PUT",
    options: {
      validate: {
        payload: offerSchema,
      },
    },
    handler: updateOffer,
  },
  {
    path: "/getOfferDetails/{id}",
    method: "GET",
    options: {
      validate: {
        params: getOfferDetailsQueryValidator,
      },
    },
    handler: getOfferDetails,
  },
];
