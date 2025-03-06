// import { Request, ResponseToolkit } from "@hapi/hapi";
// import { IQuizHookPayload } from "../interfaces/IQuizHookPayload";
// import { BaseError } from "sequelize";
// import { getTokenFromHeader, readJwtClaims } from "../utils/jwtUtil";
// import { IJwt } from "../interfaces/IJwt";
// import CompanyDetail from "../models/CompanyDetail";
// import CompanyOffer from "src/models/CompanyOffer";
// import CompanyTestimonial from "src/models/CompanyTestimonial";
// import { failureResponse } from "src/utils/apiResponse";

// export const generateQuizHooks = async (
//   request: Request,
//   h: ResponseToolkit
// ) => {
//   const payload = request.payload as IQuizHookPayload;

//   try {
//     const token = getTokenFromHeader(request);
//     const claims = readJwtClaims(token) as IJwt;
//     const userId = claims.id;

//     const company = await CompanyDetail.findOne({
//       where: {
//         id: payload.companyId,
//       },
//       include: [
//         {
//           model: CompanyOffer,
//         },
//       ],
//     });

//     if (!company) {
//       return h.response({ message: "Company not found" }).code(404);
//     }

//     if (company.userId !== userId) {
//       return h.response(failureResponse("Unauthorized")).code(401);
//     }

//     generateQuizHooks(company, payload)
//   } catch (err: any) {
//     const errors = err?.errors as BaseError[];
//     if (errors) {
//       err.message = `Type: ${err?.name},  ${
//         errors && errors.map((x) => x.message).join(", ")
//       }`;
//     }
//     return err;
//   }
// };
