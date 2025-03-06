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
  id?: number;
  companyName: string; // Name of the company
  industry: string; // Industry category
  primaryProductsOrServices: string; // Main products or services
  companyDescription: string; // Summary of what the business does
  primaryGoal: string; // Goal (e.g., increase sales, generate leads)
  targetAudience: string; // Description of the ideal customer
  primaryCustomerPainPoints: string; // Challenges faced by customers
  offers: CompanyOffer[]; // List of associated company offers
  testimonials: string; // List of associated testimonials
  userId?: number;
  isPrimary?: boolean;
}

// Define an Offer Interface
interface Offer {
  offerName: string;
  offerDescription: string;
  offerGoal: string;
  offerTopic: string;
  price: string | number; // Price can be a string (user input) or converted to a number
  primaryBenefits: string;
  targetActionURL: string;
}

// Define a CompanyDetails Interface
interface CompanyDetails {
  companyName: string;
  industry: string;
  companyDescription: string;
  primaryGoal: string;
  targetAudience: string;
  primaryProductsOrServices: string;
  primaryCustomerPainPoints: string;
  testimonials: string;
}

// Define the Payload Interface for API Request
export interface AddCompanyPayload {
  companyDetails: CompanyDetails;
  offers: Offer[];
  website: string;
  isOnboarded: boolean;
  userId: string;
}

export type ICompanyDetailsWithoutOffers = Omit<ICompanyDetails, "offers">;
