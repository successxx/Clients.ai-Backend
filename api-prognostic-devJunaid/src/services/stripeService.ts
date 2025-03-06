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
            currentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
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
          const userPlan = "Premium";
          if (user) {
            await user.update({
              stripeCustomerId: stripeCustomerId,
              isPaymentVerified: true,
            });
            
            // Get current year for copyright
            const currentYear = new Date().getFullYear();
            
            const emailTemplate = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Subscription Confirmation</title>
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
      .feature-checkmark {
        color: #252525;
        font-weight: bold;
      }
      .cta-button {
        background-color: #252525;
        color: white;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 4px;
        font-weight: 600;
        display: inline-block;
        margin: 20px 0;
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
                    Congratulations ${user.name?.split(' ')[0] || user.name}.
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
                      padding: 40px 30px;
                      text-align: left;
                      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    "
                  >
                    <tr>
                      <td>
                        <p
                          style="
                            font-size: 15px;
                            line-height: 1.6;
                            color: #333;
                            margin-bottom: 20px;
                            font-family: 'Montserrat', -apple-system,
                              BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
                              Arial, sans-serif;
                          "
                        >
                          You've just unlocked the most advanced AI agents ever designed to help you close more deals, retain more clients, and scale like never before. Every campaign, every interaction, every lead—now powered by precision, intelligence, and automation.
                        </p>
                        
                        <p
                          style="
                            font-size: 15px;
                            line-height: 1.6;
                            color: #333;
                            margin-bottom: 15px;
                            font-family: 'Montserrat', -apple-system,
                              BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
                              Arial, sans-serif;
                          "
                        >
                          As you step inside your Premium Agents Portal, here's what awaits you:
                        </p>

                        <p
                          style="
                            font-size: 15px;
                            line-height: 1.6;
                            color: #333;
                            margin-bottom: 5px;
                            font-family: 'Montserrat', -apple-system,
                              BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
                              Arial, sans-serif;
                          "
                        >
                          <span class="feature-checkmark" style="color: #252525; font-weight: bold;">✅</span> AI-driven agents working around the clock, optimizing your outreach.
                        </p>
                        
                        <p
                          style="
                            font-size: 15px;
                            line-height: 1.6;
                            color: #333;
                            margin-bottom: 5px;
                            font-family: 'Montserrat', -apple-system,
                              BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
                              Arial, sans-serif;
                          "
                        >
                          <span class="feature-checkmark" style="color: #252525; font-weight: bold;">✅</span> Data-backed, high-converting campaigns—built in moments.
                        </p>
                        
                        <p
                          style="
                            font-size: 15px;
                            line-height: 1.6;
                            color: #333;
                            margin-bottom: 20px;
                            font-family: 'Montserrat', -apple-system,
                              BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
                              Arial, sans-serif;
                          "
                        >
                          <span class="feature-checkmark" style="color: #252525; font-weight: bold;">✅</span> A seamless, intuitive experience that keeps getting smarter.
                        </p>
                        
                        <p
                          style="
                            font-size: 15px;
                            line-height: 1.6;
                            color: #333;
                            margin-bottom: 20px;
                            font-family: 'Montserrat', -apple-system,
                              BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
                              Arial, sans-serif;
                          "
                        >
                          Take a moment to appreciate this. You didn't just buy AI Agents—you invested in an edge over your competition. The kind that separates leaders from the rest.
                        </p>
                        
                        <p
                          style="
                            font-size: 15px;
                            line-height: 1.6;
                            color: #333;
                            margin-bottom: 10px;
                            font-weight: 600;
                            font-family: 'Montserrat', -apple-system,
                              BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
                              Arial, sans-serif;
                          "
                        >
                          Your account is now ready.
                        </p>
                        
                        <div style="text-align: center; margin: 25px 0;">
                          <a 
                            href="https://app.clients.ai/login" 
                            class="cta-button"
                            style="
                              background-color: #252525;
                              color: white;
                              padding: 12px 24px;
                              text-decoration: none;
                              border-radius: 4px;
                              font-weight: 600;
                              display: inline-block;
                            "
                          >
                            Log in to Your Premium Portal
                          </a>
                        </div>
                        
                        <p
                          style="
                            font-size: 15px;
                            line-height: 1.6;
                            color: #333;
                            margin-bottom: 30px;
                            font-family: 'Montserrat', -apple-system,
                              BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
                              Arial, sans-serif;
                          "
                        >
                          Welcome to the future of client acquisition. It belongs to you now.
                        </p>
                        
                        <p
                          style="
                            font-size: 15px;
                            line-height: 1.6;
                            color: #333;
                            margin-bottom: 0;
                            font-family: 'Montserrat', -apple-system,
                              BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
                              Arial, sans-serif;
                          "
                        >
                          Fiat Lux,<br>
                          – The Clients.ai Team
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
                  Copyright © ${currentYear}. All Rights Reserved.
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
</html>`;
            const sendSmtpEmail = {
              subject: "Welcome to Premium Agents by Clients.ai",
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
