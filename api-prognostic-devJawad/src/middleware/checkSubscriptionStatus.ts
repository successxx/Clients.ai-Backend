import Subscription from "../models/Subscription";

export const verifyPaymentStatus = async (userId: number) => {
  const subscription = await Subscription.findOne({
    where: { userId, status: "active" },
  });

  if (!subscription) {
    throw new Error("No active subscription found for the user.");
  }

  const now = new Date();
  if (now > subscription.currentPeriodEnd) {
    throw new Error("Subscription expired. Please renew.");
  }

  return subscription;
};
