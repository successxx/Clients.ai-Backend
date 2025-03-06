import {
  ICompanyDetails,
  ICompanyDetailsWithoutOffers,
  ICompanyOffer,
} from "./ICompany";

export interface IOptInDetails {
  email: string; // User's email address
  firstName: string; // User's first name
  lastName: string; // User's last name
  website: string; // A valid URI for the user's website
}

export interface ICampaign {
  id?: number;
  campaignName: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  type: "web_scan" | "quiz";
  status: "Active" | "Inactive" | "Draft" | "Completed";
  creationDate?: Date;
  companyId: number;
  userId: number;
  companyDetails?: ICompanyDetailsWithoutOffers;
  offers: ICompanyOffer[];
  optInDetails: IOptInDetails;
}
