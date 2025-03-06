import CompanyDetail from "../models/CompanyDetail";
import { quizHookGenerationPrompt } from "../prompts/quizHookGenerationPrompt";
import {
  IGetQuizPayload,
  IQuizHookPayload,
} from "../interfaces/IQuizHookPayload";
import User from "../models/User";
import { IAddCampaignPayload } from "../interfaces/ICampaign";
import OpenAI from "openai";
import { callChatCompletionsAPI } from "./aiService";
import { QUIZ_SYSTEM_PROMPT } from "../constants";
import { generateQuizHook } from "../controllers/quizController";
import { generateQuizPrompt } from "../prompts/quizGenerationPrompt";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

export const generateQuizHooks = async (
  user: User,
  campaign: Partial<IAddCampaignPayload>
) => {
  try {
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

    const response = await openai.chat.completions.create({
      model: "chatgpt-4o-latest",
      messages: [
        {
          role: "system",
          content:
            "You are a creative and versatile marketing content writer skilled at crafting engaging, persuasive, and brand-aligned content for various platforms to captivate audiences and drive action. The response should be in json format adhering to the camel case naming convention.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 4096, // Set maximum tokens for the response
      temperature: 0.7, // Set the creativity level
      response_format: { type: "json_object" },
    });

    const choices = response.choices;
    if (
      !choices ||
      choices.length === 0 ||
      !choices[0].message ||
      !choices[0].message.content
    ) {
      throw new Error("Invalid response from OpenAI API");
    }

    const aiResponseContent = choices[0].message.content;
    const jsonContent = JSON.parse(aiResponseContent);
    return jsonContent;
  } catch (error: any) {
    console.error("Error calling OpenAI API:", error);
    throw new Error(error);
  }
};

export const generateQuiz = async (payload: IGetQuizPayload, user: User) => {
  try {
    const userPrompt = generateQuizPrompt(payload, user);
    const quizData = await callChatCompletionsAPI(
      QUIZ_SYSTEM_PROMPT,
      userPrompt
    );
    return quizData;
  } catch (error: any) {
    console.error("Error calling OpenAI API:", error);
    throw new Error(error);
  }
};
