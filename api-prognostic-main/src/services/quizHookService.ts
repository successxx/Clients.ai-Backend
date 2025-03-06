import CompanyDetail from "../models/CompanyDetail";
import { quizHookGenerationPrompt } from "../prompts/quizHookGenerationPrompt";
import { IQuizHookPayload } from "../interfaces/IQuizHookPayload";
import { ICampaign } from "../interfaces/ICampaign";
import User from "../models/User";
import Anthropic from "@anthropic-ai/sdk";

export const generateQuizHooks = async (
  user: User,
  campaign: Partial<ICampaign>
) => {
  const prompt = quizHookGenerationPrompt(
    user.name,
    campaign.optInDetails?.email ?? user.email,
    campaign.optInDetails?.website ?? "",
    "Name:" +
      campaign.companyDetails!.companyName +
      ".Description:" +
      campaign.companyDetails!.companyDescription +
      ".Industry:" +
      campaign.companyDetails!.industry,
    campaign.offers![0].offerGoal,
    campaign.offers![0].offerName,
    campaign.offers![0].primaryBenefits,
    campaign.offers![0].targetActionURL,
    campaign.offers![0].price ?? "",
    campaign.companyDetails!.testimonials,
    campaign.offers![0].offerTopic
  );

  const anthropic = new Anthropic({
    apiKey:
      "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", // defaults to process.env["ANTHROPIC_API_KEY"]
  });

  const msg = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });
  console.log(msg);
};
