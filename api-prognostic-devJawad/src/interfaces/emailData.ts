export interface IEmailData {
  id: number;
  emailSubject: string;
  emailContent: string;
  webscanSubmission: {
    firstName: string;
    email: string;
    webscanCampaign: {
      company: {
        companyName: string;
        smtpEmail: string;
      };
    };
  };
}
