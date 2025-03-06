import Stripe from "stripe";
import Subscription from "../models/Subscription";
import User from "../models/User";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-10-28.acacia",
});

export const createSubscription = async (
  userId: number,
  plan: "monthly" | "yearly",
  isTrial: boolean = false
) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  const prices = {
    monthly: process.env.STRIPE_MONTHLY_PRICE_ID || "",
    yearly: process.env.STRIPE_YEARLY_PRICE_ID || "",
  };

  if (!prices[plan]) throw new Error("Invalid plan");

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [
      {
        price: prices[plan],
        quantity: 1,
      },
    ],
    customer_email: user.email,
    success_url: `${process.env.FRONTEND_URL}/payment-success?userId=${user.id}`,
    cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
    metadata: {
      userId: user.id.toString(),
      plan: plan,
    },
    subscription_data: {
      trial_period_days: isTrial ? 365 : undefined, // 1-year trial for special link
      metadata: {
        userId: user.id.toString(), // Metadata for the subscription
        plan: plan,
      },
    },
  });

  return session.url;
};
