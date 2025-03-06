import { Company } from "@getbrevo/brevo";
import { IOffer } from "./IOffer";
import CompanyOffer from "../models/CompanyOffer";

export interface ITestimonial {
  id: number;
  content: string; // Testimonial text
  attribution?: string; // Customer name or company
  companyId: number;
}

export interface ICompanyOffer {
  id: number;
  offerName: string; // Name of the offer
  price?: string; // Price or pricing range (optional)
  offerDescription: string; // Description of the offer
  primaryBenefits: string; // Unique benefits of the offer
  targetActionURL: string; // Link to the offer
  companyId: number;
  offerGoal: string;
  offerTopic: string;
}

export interface ICompanyDetails {
  id: number;
  companyName: string; // Name of the company
  industry: string; // Industry category
  primaryProductsOrServices: string; // Main products or services
  companyDescription: string; // Summary of what the business does
  primaryGoal: string; // Goal (e.g., increase sales, generate leads)
  targetAudience: string; // Description of the ideal customer
  primaryCustomerPainPoints: string; // Challenges faced by customers
  offers: CompanyOffer[]; // List of associated company offers
  testimonials: string; // List of associated testimonials
  userId: number;
  isPrimary: boolean;
}

export type ICompanyDetailsWithoutOffers = Omit<ICompanyDetails, "offers">;
