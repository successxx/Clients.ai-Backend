import OpenAI from "openai";
import { QUIZ_SYSTEM_PROMPT } from "../constants";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

export const callChatCompletionsAPI = async (
  systemPrompt: string,
  userPrompt: string
) => {
  try {
    const response = await openai.chat.completions.create({
      model: "chatgpt-4o-latest",
      messages: [
        {
          role: "system",
          content:
            systemPrompt +
            ". Your response should be in JSON format while following the camel case naming convention",
        },
        { role: "user", content: userPrompt },
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
