import Stripe from "stripe";
import Subscription from "../models/Subscription";
import Invoice from "../models/Invoice";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-11-20.acacia" as any,
});

export const handleWebhook = async (req: any, sig: string) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

  try {
    const rawBody = req.body;
    const verifiedEvent = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);

    switch (verifiedEvent.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        const subscription = verifiedEvent.data.object as Stripe.Subscription;
        await Subscription.upsert({
          where: { stripeSubscriptionId: subscription.id },
          update: {
            userId: Number(subscription.metadata.userId),
            plan: subscription.items.data[0].price.nickname!,
            status: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
          create: {
            stripeSubscriptionId: subscription.id,
            userId: Number(subscription.metadata.userId),
            plan: subscription.items.data[0].price.nickname!,
            status: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          }
        });
        break;

      case "invoice.payment_succeeded":
        const invoice = verifiedEvent.data.object as Stripe.Invoice;
        const userId = invoice.metadata?.userId;

        if (userId) {
          await Invoice.create({
            userId: parseInt(userId),
            amountPaid: invoice.amount_paid,
            status: invoice.status,
            invoiceId: invoice.id,
            subscriptionId: invoice.subscription,
          });
        }
        break;

      default:
        console.log(`Unhandled event type: ${verifiedEvent.type}`);
    }
  } catch (err:any) {
    console.error("Error handling webhook:", err);
    throw new Error(`Webhook verification failed: ${err.message}`);
  }
};
