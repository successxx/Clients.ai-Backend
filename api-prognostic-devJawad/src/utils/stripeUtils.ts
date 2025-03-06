// utils/stripeUtils.ts
import User from "../models/User";
import CompanyDetail from "../models/CompanyDetail";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-11-20.acacia" as any,
});

export const calculateCharge = (leadCount: number): number => {
  const freeLeads = 500;
  if (leadCount <= freeLeads) {
    return 0; // No charge if leads are within the free limit
  }
  const excessLeads = leadCount - freeLeads;
  const chargePerLead = 0.1; // $0.10 per lead
  return excessLeads * chargePerLead;
};

export const chargeCompany = async (companyId: number, amount: number) => {
  const company = await CompanyDetail.findByPk(companyId);
  if (!company) {
    throw new Error("Company not found");
  }
  const user = await User.findByPk(company!.userId);

  if (!user || !user.stripeCustomerId) {
    throw new Error("User or Stripe customer ID not found");
  }

  await stripe.charges.create({
    amount: Math.round(amount * 100), // Convert dollars to cents
    currency: "usd",
    customer: user.stripeCustomerId!,
    description: `Charge for excess leads`,
  });
};
