import { Request, ResponseToolkit, ServerRoute } from "@hapi/hapi";
import { createSubscription } from "../services/paymentService";
import { handleWebhook } from "../services/stripeService";
import { ISubscriptionRequestPayload } from "../interfaces/ISubscriptionRequestPayload";
import { IWebhookRequestPayload } from "../interfaces/IWebhookRequestPayload";
import { subscriptionValidator } from "../validators/subscriptionValidator";
import { webhookValidator } from "../validators/webhookValidatior";
import Subscription from "../models/Subscription";

export const PaymentRoutes: ServerRoute[] = [
  {
    method: "POST",
    path: "/start",
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const { userId, plan } = request.payload as ISubscriptionRequestPayload;

        const { error } = subscriptionValidator.validate({ userId, plan });
        if (error) {
          return h.response({ error: error.details[0].message }).code(400);
        }

        const url = await createSubscription(userId, plan);
        return h.response({ url }).code(200);
      } catch (error: any) {
        console.error("Error creating subscription:", error);
        return h.response({ error: error.message }).code(400);
      }
    },
    options: {
      description: "Start a subscription",
      notes: "Creates a new subscription for a user",
      tags: ["api", "payment"],
      auth: false,
    },
  },
  {
    method: "POST",
    path: "/webhook",
    handler: async (request: Request, h: ResponseToolkit) => {
      const sig = request.headers["stripe-signature"] as string;

      try {
        const { error } = webhookValidator.validate(request.payload);
        if (error) {
          return h.response({ error: error.details[0].message }).code(400);
        }

        const event = request.payload as IWebhookRequestPayload;
        await handleWebhook(event, sig);
        return h.response({ received: true }).code(200);
      } catch (error: any) {
        console.error("Webhook error:", error);
        return h.response({ error: error.message }).code(400);
      }
    },
    options: {
      description: "Stripe webhook handler",
      notes: "Handles Stripe webhook events such as payment succeeded",
      tags: ["api", "payment"],
      auth: false,
    },
  },
  {
    method: "GET",
    path: "/verify-subscription",
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const { userId } = request.query;
  
        if (!userId) {
          return h.response({ error: "Missing userId parameter" }).code(400);
        }
  
        const subscription = await Subscription.findOne({ where: { userId } });
        if (!subscription) {
          return h.response({ error: "No subscription found" }).code(404);
        }
  
        return h.response({ subscription }).code(200);
      } catch (error: any) {
        console.error("Verification error:", error);
        return h.response({ error: error.message }).code(500);
      }
    },
    options: {
      description: "Verify subscription",
      notes: "Verifies the subscription status for a user",
      tags: ["api", "payment"],
      auth: false,
    },
  }
  
];
