import Stripe from "stripe";
import Subscription from "../models/Subscription";
import Invoice from "../models/Invoice";
import User from "../models/User";
import { sendEmailFromService } from "./emailService";
import WebscanCampaign from "src/models/webScanCampaign";
import WebscanSubmission from "src/models/webScanSubmission";
import { calculateCharge, chargeCompany } from "src/utils/stripeUtils";
import path from "path";
import fs from "fs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-11-20.acacia" as any,
});

export const handleWebhook = async (verifiedEvent: any, sig: string) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

  try {
    // const rawBody = req.body;
    // const verifiedEvent = stripe.webhooks.constructEvent(
    //   rawBody,
    //   sig,
    //   endpointSecret
    // );

    switch (verifiedEvent.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        const userPlan = "Basic Plan";
        const subscription = verifiedEvent.data.object as any;
        const existingSubscription = await Subscription.findOne({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (existingSubscription) {
          // Update existing subscription
          await Subscription.update(
            {
              userId: Number(subscription.metadata.userId),
              plan: userPlan + " " + subscription.metadata.plan,
              status: subscription.status,
              currentPeriodStart: new Date(
                subscription.current_period_start * 1000
              ),
              currentPeriodEnd: new Date(
                subscription.current_period_end * 1000
              ),
            },
            {
              where: { stripeSubscriptionId: subscription.id },
            }
          );
        } else {
          // Create new subscription
          await Subscription.create({
            stripeSubscriptionId: subscription.id,
            userId: Number(subscription.metadata.userId),
            plan: userPlan + " " + subscription.metadata.plan,
            status: subscription.status,
            currentPeriodStart: new Date(
              subscription.current_period_start * 1000
            ),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          });
        }

        break;

      case "invoice.payment_succeeded":
        const invoice = verifiedEvent.data.object as any;
        const userId = invoice.subscription_details?.metadata?.userId;
        const stripeCustomerId = invoice.customer as string; // Retrieve the Stripe customer ID

        if (userId) {
          await Invoice.create({
            userId: parseInt(userId),
            amountPaid: invoice.amount_paid / 100,
            status: invoice.status,
            stripeInvoiceId: invoice.id,
            subscriptionId: invoice.subscription,
            paidAt: new Date(invoice.created * 1000),
            invoicePdf: invoice.invoice_pdf,
          });

          const user = await User.findOne({ where: { id: parseInt(userId) } });
          const userPlan = "Basic Plan";
          if (user) {
            await user.update({
              stripeCustomerId: stripeCustomerId,
              isPaymentVerified: true,
            });
            const emailTemplate = `  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
    <link
      href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap"
      rel="stylesheet"
    />
    <!--[if !mso]><!-->
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap");
    </style>
    <!--<![endif]-->
    <style>
      * {
        font-family: "Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, Helvetica, Arial, sans-serif;
      }
      .email-container {
        max-width: 600px;
        margin: 0 auto;
      }
    </style>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI',
        Roboto, Helvetica, Arial, sans-serif;
      background-color: #ffffff;
    "
  >
    <div
      class="email-container"
      style="background-color: #f0f4f8; max-width: 600px; margin: 0 auto"
    >
      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        style="background-color: #f0f4f8; padding: 20px 0"
      >
        <tr>
          <td align="center">
            <table
              width="500"
              cellspacing="0"
              cellpadding="0"
              border="0"
              style="
                font-family: 'Montserrat', -apple-system, BlinkMacSystemFont,
                  'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              "
            >
              <tr>
                <td style="padding: 30px; text-align: center">
                  <h1
                    style="
                      font-size: 22px;
                      font-weight: 600;
                      margin: 0;
                      font-family: 'Montserrat', -apple-system,
                        BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial,
                        sans-serif;
                    "
                  >
                    Your Subscription Confirmation
                  </h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 0 20px">
                  <table
                    width="100%"
                    cellspacing="0"
                    cellpadding="0"
                    border="0"
                    style="
                      background-color: #ffffff;
                      border-radius: 8px;
                      padding: 80px 20px;

                      text-align: center;
                      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    "
                  >
                    <tr>
                      <td>
                        <p
                          style="
                            font-size: 13px;
                            font-weight: 400;
                            color: #666;
                            margin: 0;
                            font-family: 'Montserrat', -apple-system,
                              BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
                              Arial, sans-serif;
                          "
                        >
                          Thank you for your purchase! We're excited to confirm
                          your subscription to
                          <strong
                            style="color: #0142ac; text-decoration: underline"
                            >${userPlan}</strong
                          >.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td
                  style="
                    padding: 20px;
                    text-align: center;
                    font-size: 12px;
                    color: #9ca3af;
                    font-family: 'Montserrat', -apple-system, BlinkMacSystemFont,
                      'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                  "
                >
                  Copyright © 2024. All Rights Reserved.
                  <br />
                  <strong
                    style="
                      color: #1f2937;
                      font-family: 'Montserrat', -apple-system,
                        BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial,
                        sans-serif;
                    "
                    >Clients.ai</strong
                  >
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>
`;
            const sendSmtpEmail = {
              subject: "Payment Successful - Clients.ai",
              htmlContent: emailTemplate,
              to: [
                {
                  email: user.email,
                  name: user.name,
                },
              ],
            };

            await sendEmailFromService(sendSmtpEmail);
          }
        }
        break;

      default:
        console.log(`Unhandled event type: ${verifiedEvent.type}`);
    }
  } catch (err: any) {
    console.error("Error handling webhook:", err);
    throw new Error(`Webhook verification failed: ${err.message}`);
  }
};
