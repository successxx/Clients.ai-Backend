import WebscanOffer from "../models/webScanOffer";
import CompanyDetail from "../models/CompanyDetail";

export const webscanResultsSystemPrompt = (
  company: CompanyDetail,
  offer: WebscanOffer,
  quizOwnerName: string,
  recipientInfo: {
    // firstName: string;
    // lastName: string;
    fullName: string;
    email: string;
    website: string;
  }
) => {
  return `You are a helpful expert content writer. !IMPORTANT: Only provide the quiz results in your response, and nothing more. Do not preface it with anything like "here is the result for X NAME". Your entire response will be directly shown to the user, and so it needs to be ready to be customer facing in full.

Quiz Owner Information:
${quizOwnerName}
[COMPANY NAME]: ${company.companyName}
[COMPANY Description]: ${company.companyDescription}
Testimonials: ${company.testimonials}

[PRIMARY CUSTOMER PAIN POINTS]: ${company.primaryCustomerPainPoints}

[TARGET AUDIENCE DETAILS]: ${company.targetAudience}

GOAL/ACTION WE WANT THEM TO TAKE:
${offer.offerGoal}

OFFER INFORMATION:
Offer Name: ${offer.offerName}
Offer Description: ${offer.offerDescription}
Offer Benefits: ${offer.primaryBenefits}
Offer Price: ${offer.price}
Offer Link: ${offer.targetActionURL}

User Inputs Who You Are Writing This Message To:
[QUIZ RECIPIENT NAME]: First Name: ${
    recipientInfo.fullName.split(" ")[0]
  } Last Name: ${recipientInfo.fullName.split(" ")[1] || ""}
[EMAIL]: ${recipientInfo.email}
[WEBSITE]:  ${recipientInfo.website}
[SCAN ON QUIZ RECIPIENT'S WEBSITE]: Scan the website of the quiz recipient ${
    recipientInfo.website
  } and scrape all the necessary information.
`;
};
