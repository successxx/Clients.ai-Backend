import { ServerRoute } from "@hapi/hapi";
import { addOrUpdateSMTPEmail, addSMTPConfig, getSMTPConfig, updateSMTPConfig } from "../controllers/smtpConfigController";
import { smtpConfigSchema, smtpEmailSchema } from "../validators/smtpConfigValidator";

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
      {
        method: "POST",
        path: "/smtp-email/{companyId}",
        handler: addOrUpdateSMTPEmail,
        options: {
          auth: "jwt",
          validate: {
            payload: smtpEmailSchema,
          },
        },
      },
];
