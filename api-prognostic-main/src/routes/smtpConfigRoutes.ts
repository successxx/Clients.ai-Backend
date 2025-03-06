import { ServerRoute } from "@hapi/hapi";
import { addSMTPConfig, getSMTPConfig, updateSMTPConfig } from "../controllers/smtpConfigController";
import { smtpConfigSchema } from "../validators/smtpConfigValidator";

export const SmtpConfigRoutes: ServerRoute[] = [
    {
        method: "POST",
        path: "/smtp-config",
        handler: addSMTPConfig,
        options: {
          auth: "jwt",
          validate: {
            payload: smtpConfigSchema,
          },
        },
      },
      {
        method: "GET",
        path: "/smtp-config/{companyId}",
        handler: getSMTPConfig,
        options: {
          auth: "jwt",
        },
      },
      {
        method: "PUT",
        path: "/smtp-config/{companyId}",
        handler: updateSMTPConfig,
        options: {
          auth: "jwt",
          validate: {
            payload: smtpConfigSchema,
          },
        },
      },
];
