import { IOptInDetails } from "./ICampaign";

export interface IQuizHookPayload {
  companyId: number;
  firstName: string;
  lastName: string;
  description: string;
  topic: string;
  email: string;
  website: string;
}

export interface IGetQuizPayload {
  companyDetails: {
    userId: number;
    companyId: number;
    companyName: string;
    industry: string;
    companyDescription: string;
    primaryCustomerPainPoints: string;
    primaryGoal: string;
    primaryProductsOrServices: string;
    targetAudience: string;
    testimonials: string;
  };
  campaignDetails: {
    campainId: number;
    type: string;
    campaignName: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    status: string;
  };
  offers: {
    offerName: string;
    offerTopic: string;
    price?: string;
    offerDescription: string;
    primaryBenefits: string;
    targetActionURL: string;
    offerGoal: string;
  }[];
  quizTitle: string;
  optInDetails?: IOptInDetails;
}
