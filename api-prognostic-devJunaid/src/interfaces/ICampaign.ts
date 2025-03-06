import { ICompanyDetailsWithoutOffers, ICompanyOffer } from "./ICompany";

// export interface ICampaign {
//   id?: number;
//   campaignName: string;
//   startDate: Date;
//   endDate: Date;
//   startTime: string;
//   endTime: string;
//   type: "web_scan" | "quiz";
//   status: "Active" | "Inactive" | "Draft" | "Completed";
//   creationDate?: Date;
//   companyId: number;
//   userId: number;
//   companyDetails?: ICompanyDetailsWithoutOffers;
//   offers: ICompanyOffer[];
//   optInDetails: IOptInDetails;
// }

interface ICompanyDetails {
  companyId: number | null;
  userId: any;
  companyName: string;
  industry: string;
  primaryProductsOrServices: string;
  companyDescription: string;
  primaryCustomerPainPoints: string;
  primaryGoal: string;
  testimonials: string;
  targetAudience: string;
}

interface IOfferDetails {
  offerName: string;
  offerTopic: string;
  price: string;
  offerDescription: string;
  offerGoal: string;
  primaryBenefits: string;
  targetActionURL: string;
}

interface ICampaignDetails {
  campaignName: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  status: string;
  type: string;
}

export interface IOptInDetails {
  firstName: string;
  lastName: string;
  email: string;
  website: string;
}

export interface IAddCampaignPayload {
  companyDetails: ICompanyDetails;
  offers: IOfferDetails[];
  campaignDetails: ICampaignDetails;
  optInDetails: IOptInDetails;
}

// Interface for each answer
export interface TypeformAnswer {
  field: {
    id: string;  // The field ID (not used directly here)
    ref: string; // The meaningful reference
    type: string; // The type of field (short_text, email, etc.)
  };
  type: string; // Type of the answer (text, email, phone_number, etc.)
  text?: string;
  email?: string;
  phone_number?: string;
}

// Interface for a form submission
export interface TypeformSubmission {
  response_id: string; // Unique ID for the response
  submitted_at: string; // When the form was submitted
  answers: TypeformAnswer[]; // Array of answers
}

interface QuizOffer {
  offerName: string;
  price: string;
  offerDescription: string;
  primaryBenefits: string;
  offerGoal: string;
  offerTopic: string;
  targetActionURL: string;
}

export interface QuizPayload {
  campaignName:string;
  testimonial: string;
  offers: QuizOffer[];
}
