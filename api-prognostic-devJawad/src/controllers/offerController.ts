import { Request, ResponseToolkit } from "@hapi/hapi";
import { failureResponse, successResponse } from "../utils/apiResponse";
import sequelize from "../config/db";

import { IOffer } from "../interfaces/IOffer";
import Offer from "../models/Offer";
import { BaseError, Op } from "sequelize";
import { paginate, paginateResponse } from "../utils/paginationUtil";
import { getTokenFromHeader, readJwtClaims } from "../utils/jwtUtil";
import { IJwt } from "../interfaces/IJwt";

export const createOffer = async (request: Request, h: ResponseToolkit) => {
  try {
    const payload = request.payload as Partial<IOffer>;
    await Offer.create(payload);
    return h
      .response(successResponse("", "Offer created successfully"))
      .code(201);
  } catch (err: any) {
    const errors = err?.errors as BaseError[];
    if (errors) {
      err.message = `Type: ${err?.name},  ${
        errors && errors.map((x) => x.message).join(", ")
      }`;
    }
    return err;
  }
};

export const getOfferList = async (request: Request, h: ResponseToolkit) => {
  const { page = 1, pageSize = 10, search } = request.query;
  const token = getTokenFromHeader(request);
  const claims = readJwtClaims(token) as IJwt;
  const userId = claims.id;
  try {
    const { limit, offset } = paginate(Number(page), Number(pageSize));

    // Build the dynamic where clause
    const whereClause: any = { userId: Number(userId) };
    if (search) whereClause.offerName = { [Op.like]: `%${search}%` };

    // Fetch offers with pagination
    const { rows, count } = await Offer.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["id", "DESC"]],
    });

    // Create a paginated response
    const response = paginateResponse(
      rows,
      count,
      Number(page),
      Number(pageSize)
    );
    return h
      .response(successResponse(response, "Offers retrieved successfully"))
      .code(200);
  } catch (err: any) {
    const errors = err?.errors as BaseError[];
    if (errors) {
      err.message = `Type: ${err?.name},  ${
        errors && errors.map((x) => x.message).join(", ")
      }`;
    }
    return err;
  }
};

export const updateOffer = async (request: Request, h: ResponseToolkit) => {
  try {
    const payload = request.payload as Partial<IOffer>;
    const token = getTokenFromHeader(request);
    const claims = readJwtClaims(token) as IJwt;
    const userId = claims.id;

    // Find the existing offer
    const offer = await Offer.findByPk(payload.id);
    if (!offer) {
      return h.response(failureResponse("Offer not found")).code(404);
    }

    // Check if the offer belongs to the user
    if (offer.userId !== userId) {
      return h.response(failureResponse("Unauthorized")).code(401);
    }
    // Update the offer with the provided payload
    await offer.update(payload);

    return h
      .response(successResponse("", "Offer updated successfully"))
      .code(200);
  } catch (err: any) {
    const errors = err?.errors as BaseError[];
    if (errors) {
      err.message = `Type: ${err?.name},  ${
        errors && errors.map((x) => x.message).join(", ")
      }`;
    }
    return err;
  }
};

export const getOfferDetails = async (request: Request, h: ResponseToolkit) => {
  try {
    const { id } = request.params; // Extract the offer ID from the request parameters
    const token = getTokenFromHeader(request);
    const claims = readJwtClaims(token) as IJwt;
    const userId = claims.id;

    // Find the existing offer
    const offer = await Offer.findByPk(id);
    if (!offer) {
      return h.response(failureResponse("Offer not found")).code(404);
    }

    // Check if the offer belongs to the user
    if (offer.userId !== userId) {
      return h.response(failureResponse("Unauthorized")).code(401);
    }

    return h.response(successResponse(offer, "")).code(200);
  } catch (err: any) {
    const errors = err?.errors as BaseError[];
    if (errors) {
      err.message = `Type: ${err?.name},  ${
        errors && errors.map((x) => x.message).join(", ")
      }`;
    }
    return err;
  }
};
