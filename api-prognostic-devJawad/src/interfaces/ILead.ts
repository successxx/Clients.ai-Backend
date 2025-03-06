export interface ILead {
    id?: number;
    firstName: string;
    lastName?: string;
    email: string;
    phone?: string;
    source: "WEB" | "PHONE" | "EMAIL" | "REFERRAL" | "OTHER";
  }
  