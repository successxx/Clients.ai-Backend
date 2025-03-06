import { Request, ResponseToolkit } from "@hapi/hapi";
import CompanyDetail from "../models/CompanyDetail";
import { failureResponse, successResponse } from "../utils/apiResponse";
import sequelize from "../config/db";
import { ICompanyDetails } from "../interfaces/ICompany";
import CompanyOffer from "../models/CompanyOffer";
import CompanyTestimonial from "../models/CompanyTestimonial";

import { v4 as uuidv4 } from "uuid";
import Offer from "../models/Offer";
import { getTokenFromHeader, readJwtClaims } from "../utils/jwtUtil";
import { IJwt } from "../interfaces/IJwt";
import { BaseError, Op } from "sequelize";
import { paginate, paginateResponse } from "../utils/paginationUtil";

// function generateSubdomain(companyName: string = "default"): string {
//   const baseSubdomain = companyName.replace(/\s+/g, "").toLowerCase();
//   const uniqueSuffix = uuidv4().slice(0, 8);
//   return `${baseSubdomain}-${uniqueSuffix}`;
// }

// export const getCompanyDetailsBySubDomain = async (
//   request: Request,
//   h: ResponseToolkit
// ) => {
//   const { subdomain } = request.params;

//   try {
//     const company = await CompanyDetail.findOne({
//       where: { subdomain },
//       include: [
//         {
//           model: CompanyOffer,
//           as: "offers",
//         },
//         {
//           model: CompanyTestimonial,
//           as: "testimonials",
//         },
//       ],
//     });

//     if (!company) {
//       return h.response({ message: "Company not found" }).code(404);
//     }

//     return h.response(company).code(200);
//   } catch (error) {
//     return h.response({ message: "Error fetching company details" }).code(500);
//   }
// };

export const getCompanyDetails = async (
  request: Request,
  h: ResponseToolkit
) => {
  const token = getTokenFromHeader(request);
  const claims = readJwtClaims(token) as IJwt;
  const userId = claims.id;

  try {
    const company = await CompanyDetail.findOne({
      where: {
        userId: userId,
      },
      include: [
        {
          model: CompanyOffer,
        },
      ],
    });

    if (!company) {
      return h.response(failureResponse("Company not found")).code(404);
    }

    return h.response(successResponse(company, "")).code(200);
  } catch (error) {
    return h
      .response(failureResponse("Error fetching company details"))
      .code(500);
  }
};

export const addCompanyDetails = async (
  request: Request,
  h: ResponseToolkit
) => {
  const payload = request.payload as Partial<ICompanyDetails>;
  const transaction = await sequelize.transaction();
  try {
    // const subdomain = generateSubdomain(payload.companyName || "prognostic");
    const { offers, ...rest } = payload;

    const companyDetails = await CompanyDetail.create(rest, { transaction });
    companyDetails.isPrimary = true;
    await companyDetails.save({ transaction });
    payload.offers![0].companyId = companyDetails.id;

    await CompanyOffer.create(payload.offers![0] as any, { transaction });

    await transaction.commit();

    return h
      .response(successResponse(companyDetails.id, "Company details added"))
      .code(200);
  } catch (err: any) {
    await transaction.rollback();
    const errors = err?.errors as BaseError[];
    if (errors) {
      err.message = `Type: ${err?.name},  ${
        errors && errors.map((x) => x.message).join(", ")
      }`;
    }
    return err;
  }
};

export const updateCompanyDetails = async (
  request: Request,
  h: ResponseToolkit
) => {
  const { id } = request.params;
  const payload = request.payload as ICompanyDetails;
  const transaction = await sequelize.transaction();
  const token = getTokenFromHeader(request);
  const claims = readJwtClaims(token) as IJwt;
  const userId = claims.id;

  try {
    const company = await CompanyDetail.findByPk(id);

    if (!company) {
      return h.response({ message: "Company not found" }).code(404);
    }
    if (company.userId !== userId) {
      return h.response(failureResponse("Unauthorized")).code(401);
    }

    if (payload.isPrimary !== undefined && payload.isPrimary) {
      const existingPrimaryCompany = await CompanyDetail.findOne({
        where: { userId: userId, isPrimary: true },
      });
      await existingPrimaryCompany?.update({ isPrimary: false, transaction });
    }

    await company.update(payload, { transaction });

    // if (payload.offers) {
    //   await CompanyOffer.destroy({
    //     where: { companyId: company.id },
    //     transaction,
    //   });
    //   payload.offers.forEach((offer) => {
    //     offer.companyId = company.id;
    //   });
    //   await CompanyOffer.bulkCreate(payload.offers as any, { transaction });

    payload.offers![0].companyId = company.id;
    const companyOffer = await CompanyOffer.findOne({
      where: { companyId: company.id },
    });
    await companyOffer?.update(payload.offers![0] as any, { transaction });

    // if (payload.testimonials) {
    //   await CompanyTestimonial.destroy({
    //     where: { companyId: company.id },
    //     transaction,
    //   });
    //   payload.testimonials.forEach((testimonial) => {
    //     testimonial.companyId = company.id;
    //   });
    //   await CompanyTestimonial.bulkCreate(payload.testimonials as any, {
    //     transaction,
    //   });
    // }

    await transaction.commit();
    return h
      .response(successResponse("", "Company details updated successfully"))
      .code(200);
  } catch (err: any) {
    await transaction.rollback();
    const errors = err?.errors as BaseError[];
    if (errors) {
      err.message = `Type: ${err?.name},  ${
        errors && errors.map((x) => x.message).join(", ")
      }`;
    }
    return err;
  }
};

export const selectAsPrimary = async (request: Request, h: ResponseToolkit) => {
  const { id } = request.payload as { id: number };
  const token = getTokenFromHeader(request);
  const claims = readJwtClaims(token) as IJwt;
  const userId = claims.id;
  try {
    const company = await CompanyDetail.findOne({
      where: { userId: userId, id: id },
    });

    const primaryCompany = await CompanyDetail.findOne({
      where: { userId: userId, isPrimary: true },
    });

    if (!primaryCompany) {
      return h.response({ message: "Company not found" }).code(404);
    }

    await primaryCompany.update({ isPrimary: false });

    if (!company) {
      return h.response({ message: "Company not found" }).code(404);
    }

    await company.update({ isPrimary: true });

    return h.response(successResponse("", "Primary company updated")).code(200);
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
export const companyList = async (request: Request, h: ResponseToolkit) => {
  const { page = 1, pageSize = 10, search } = request.query;
  const token = getTokenFromHeader(request);
  const claims = readJwtClaims(token) as IJwt;
  const userId = claims.id;
  try {
    const { limit, offset } = paginate(Number(page), Number(pageSize));

    const whereClause: any = { userId: Number(userId) };
    if (search) whereClause.companyName = { [Op.like]: `%${search}%` };

    const { rows, count } = await CompanyDetail.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: CompanyOffer,
        },
      ],
      limit,
      offset,
    });

    const response = paginateResponse(
      rows,
      count,
      Number(page),
      Number(pageSize)
    );
    return h.response(successResponse(response)).code(200);
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

export const addNewCompany = async (request: Request, h: ResponseToolkit) => {
  const payload = request.payload as Partial<ICompanyDetails>;
  const transaction = await sequelize.transaction();

  const token = getTokenFromHeader(request);
  const claims = readJwtClaims(token) as IJwt;
  const userId = claims.id;

  try {
    // const subdomain = generateSubdomain(payload.companyName || "prognostic");
    const { offers, ...rest } = payload;

    if (payload.isPrimary !== undefined && payload.isPrimary) {
      const existingPrimaryCompany = await CompanyDetail.findOne({
        where: { userId: userId, isPrimary: true },
      });
      await existingPrimaryCompany?.update({ isPrimary: false, transaction });
    }

    const companyDetails = await CompanyDetail.create(rest, { transaction });

    payload.offers![0].companyId = companyDetails.id;

    await CompanyOffer.create(payload.offers![0] as any, { transaction });

    await transaction.commit();

    return h
      .response(successResponse(companyDetails.id, "Company details added"))
      .code(200);
  } catch (err: any) {
    await transaction.rollback();
    const errors = err?.errors as BaseError[];
    if (errors) {
      err.message = `Type: ${err?.name},  ${
        errors && errors.map((x) => x.message).join(", ")
      }`;
    }
    return err;
  }
};
