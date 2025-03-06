import { IGetQuizPayload } from "./IQuizHookPayload";

export interface IQuizTypeformPayload {
  title: string;  // Quiz Title
  data: IGetQuizPayload;  // Reusing the existing IGetQuizPayload
  questions: Question[];
}

interface Question {
  question: string;
  options?: Option[];  // Optional for questions like "name", "email", etc.
}

interface Option {
  text: string;
}

interface WebscanOffer {
    offerName: string;
    price: string;
    offerDescription: string;
    primaryBenefits: string;
    offerGoal: string;
    offerTopic: string;
    targetActionURL: string;
  }
  
  export interface WebScanPayload {
    campaignName:string;
    testimonial: string;
    offers: WebscanOffer[];
  }
  