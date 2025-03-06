// import * as Boom from "@hapi/boom";
// import {
//   Server,
//   Request,
//   ResponseToolkit,
//   ServerRegisterPluginObject,
//   ServerRoute,
// } from "@hapi/hapi";
// import * as HapiSwagger from "hapi-swagger";
// import * as Path from "path";
// import * as Inert from "@hapi/inert";
// import * as Vision from "@hapi/vision";
// import * as Jwt from "@hapi/jwt";
// import { validateAccessToken } from "./services/authService";
// import { UserAuthRoutes } from "./routes/userAuthRoutes";
// import { CompanyRoutes } from "./routes/companyRoutes";
// import * as dotenv from "dotenv";
// import "./config/db";
// import { PaymentRoutes } from "./controllers/paymentController";
// import { getSubdomainFromRequest, getCompanyBySubdomain } from './utils/subdomainUtils';
// import { CampaignRoutes } from "./routes/campaignRoutes";
// import CompanyDetail from "./models/CompanyDetail";

// dotenv.config();

// declare module "@hapi/hapi" {
//   interface Request {
//     rawBody?: string;
//   }
// }

// const prefixRoutes = (
//   prefix: string,
//   tag: string,
//   routes: ServerRoute[]
// ): ServerRoute[] => {
//   return routes.map((route) => ({
//     ...route,
//     path: `${prefix}${route.path}`,
//     options: {
//       ...route.options,
//       tags: ["api", tag],
//     },
//   }));
// };

// const init = async () => {
//   const server = new Server({
//     port: process.env.PORT || 4000,
//     host: "0.0.0.0",
//     routes: {
//       cors: {
//         origin: ["*"],
//         headers: [
//           "Accept",
//           "Authorization",
//           "Content-Type",
//           "If-None-Match",
//           "Accept-Language",
//         ],
//         additionalHeaders: [
//           "cache-control",
//           "x-requested-with",
//           "Access-Control-Allow-Origin",
//         ],
//       },
//       validate: {
//         failAction: async (request, h, err: any) => {
//           console.error("Validation Error:", err.message);
//           throw err;
//         },
//       },
//       files: {
//         relativeTo: Path.join(__dirname, "public"),
//       },
//     },
//   });

//   const swaggerOptions: HapiSwagger.RegisterOptions = {
//     info: {
//       title: "Prognostic API Documentation",
//       version: "1.0.0",
//     },
//   };

//   const plugins: Array<ServerRegisterPluginObject<any>> = [
//     { plugin: Jwt },
//     { plugin: Inert },
//     { plugin: Vision },
//     { plugin: HapiSwagger, options: swaggerOptions },
//   ];
//   await server.register(plugins);

//   server.auth.strategy("jwt", "jwt", {
//     keys: process.env.JWT_SECRET,
//     verify: {
//       aud: false,
//       iss: false,
//       sub: false,
//     },
//     validate: validateAccessToken,
//   });
//   server.auth.default("jwt");

//   server.ext("onPreResponse", (request: Request, h: ResponseToolkit) => {
//     const response = request.response;

//     if (Boom.isBoom(response)) {
//       if (response.isServer) {
//         response.output.payload.message =
//           response.message || "Internal Server Error";
//       }
//     }

//     return h.continue;
//   });

//   server.ext("onRequest", async (request: Request, h: ResponseToolkit) => {
//     try {
//       if (request.path === "/payments/webhook") {
//         request.rawBody = request.payload as string;
//       }

//       console.log("Request hostname:", request.info.hostname);
//       console.log("Environment variables:", process.env);

//       const hostname = request.info.hostname;
//       const subdomain = hostname.includes(".") ? hostname.split(".")[0] : null;
//       console.log("Subdomain:", subdomain);
//        const company = await CompanyDetail.findOne({ where: { subdomain } });

//             if (!company) {
//                 console.warn(`No company found for subdomain: ${subdomain}`);
//                 request.headers.companyId = "0";
//             } else {
//                 request.headers.companyId = String(company.id);
//             }

//       return h.continue;
//     } catch (error) {
//       console.error("Error in onRequest:", error);
//       return Boom.internal("Internal server error during company lookup");
//     }
//   });

//   server.route([...prefixRoutes("/userAuth", "UserAuth", UserAuthRoutes)]);
//   server.route([...prefixRoutes("/company", "Company", CompanyRoutes)]);
//   server.route([...prefixRoutes("/payments", "Payments", PaymentRoutes)]);
//   server.route([...prefixRoutes("/campaigns", "Campaigns", CampaignRoutes)]);
//   server.route({
//     method: "GET",
//     path: "/",
//     options: {
//       auth: false,
//     },
//     handler: () => "Hello 999!",
//   });
//   await server.start();
//   console.log(`Server running on ${server.info.uri}`);
// };

// process.on("unhandledRejection", (err) => {
//   console.error("Unhandled Rejection:", err);
//   process.exit(1);
// });

// init();
