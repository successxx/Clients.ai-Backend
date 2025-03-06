import axios from "axios";
import Boom from "@hapi/boom";
import CompanyDetail from "../models/CompanyDetail";
import Quiz from "../models/Quiz";
import Campaign from "../models/Campaign";
import Anthropic from "@anthropic-ai/sdk";
import Joi from "joi";
import { Request, ResponseToolkit } from "@hapi/hapi";
import Question from "../models/Question";
import { Transaction } from "sequelize";


interface QuestionInput {
    question: string;
    options: {
        text: string;
        isCorrect: boolean;
    }[];
    quizId: number;
}

export const QuizTopicThroughAnthropic = async (
  quizId: number,
  companyId: number
) => {
  try {
    // Fetch quiz data
    const quiz: Quiz | null = await Quiz.findByPk(quizId);
    if (!quiz) {
      throw Boom.notFound("Quiz not found");
    }
    //console.log("quiz", quiz);

    // Fetch company details
    const company: CompanyDetail | null = await CompanyDetail.findByPk(
      companyId
    );
    if (!company) {
      throw Boom.notFound("Company details not found");
    }
    //console.log("company", company);

    try {
      // Prepare the API request payload
      // const payload = {
      //     model: "claude-4-0",
      //     max_tokens_to_sample: 1024,
      //     prompt: `Company Details: ${JSON.stringify(company)}\nProvide 10 quiz topic suggestions based on the following topic: ${quiz.topic}`,
      // };
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

      const response = await client.messages.create({
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: `Company Details: ${JSON.stringify(
              company
            )}\nProvide 10 quiz topic suggestions based on the following topic: ${
              quiz.topic
            }. Also Note that I want the response as json object of 10 strings only without any extra details or data`,
          },
        ],
        model: "claude-3-opus-20240229",
      });
      const textResponse = (response.content[0] as any).text;
      console.log(textResponse);
      if (!textResponse) {
        throw Boom.badImplementation(
          "Invalid response format from Anthropics API"
        );
      }

      // // Parse the string response into a proper array
      const formattedResponse = JSON.parse(textResponse);
      return formattedResponse;
    } catch (apiError: any) {
      if (apiError.response) {
        throw Boom.badImplementation(
          "Failed to send quiz topic to Anthropics API",
          apiError.response.data
        );
      }
      throw Boom.badImplementation(
        "Failed to send quiz topic to Anthropics API",
        apiError.message
      );
    }
  } catch (error: any) {
    if (Boom.isBoom(error)) {
      throw error;
    }
    if (error.response) {
      throw Boom.badImplementation(
        "Failed to send quiz topic to Anthropics API",
        error.response.data
      );
    }
    throw Boom.badImplementation(
      "Failed to send quiz topic to Anthropics API",
      error.message
    );
  }
};





export const saveQuestionsService = async (questions: QuestionInput[]) => {
    try {
       console.log(questions, "questions-----")
        if (!Array.isArray(questions) || questions.length === 0) {
            throw Boom.badRequest("Questions array is empty or invalid.");
        }

    
        const quizId = questions[0].quizId;
        const quiz = await Quiz.findByPk(quizId);
        if (!quiz) {
            throw Boom.notFound("Quiz not found.");
        }
  
        // Start a transaction for bulk insert
        return await Question.sequelize?.transaction(async (transaction: Transaction) => {
         
            const questionData = questions.map((q) => ({
                question: q.question,
                options: q.options,
                quizId: q.quizId,
            }));

            // Save questions in bulk
            const savedQuestions = await Question.bulkCreate(questionData, { transaction });

            return savedQuestions;
        });
    } catch (error: any) {
        if (Boom.isBoom(error)) {
            throw error;
        }
        throw Boom.badImplementation("Failed to save questions.", error);
    }
};


export const createQuizService = async (
  quizData: Partial<Quiz>
): Promise<Quiz> => {
  try {
    // Check if the campaign exists
    const campaign = await Campaign.findByPk(quizData.campaignId);
    if (!campaign) {
      throw Boom.notFound("Campaign not found");
    }

    // Create the new quiz
    const newQuiz = await Quiz.create({
      ...quizData,
      campaignId: Number(campaign.id),
    });

    console.log("quizData", newQuiz);
    return newQuiz;
  } catch (error: any) {
    throw Boom.badImplementation("Failed to create quiz", error.message);
  }
};
// export const generateQuestionsSchema = Joi.object({
//     quizId: Joi.number().required(),
//     topic: Joi.string().required(),
// });

export const generateQuestionsService = async (
  quizId: number,
  topic: string
) => {
  try {
    // Fetch quiz data
    const quiz: Quiz | null = await Quiz.findByPk(quizId);
    if (!quiz) {
      throw Boom.notFound("Quiz not found");
    }

    // Initialize Anthropics API client
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    // Send the prompt to generate 10 questions
    const response = await client.messages.create({
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `
  Generate 10 questions for the quiz topic: ${topic}. 
  I want the response as a JSON array of 10 objects. 
  Each object should have the following format:
  {
    "question": "Question text here",
    "options": [
      { "text": "Option 1", "isCorrect": false },
      { "text": "Option 2", "isCorrect": false },
      { "text": "Option 3", "isCorrect": true },
      { "text": "Option 4", "isCorrect": false }
    ]
  }
  Make sure only one option in each question has "isCorrect" set to true. Do not include any extra details or explanations.
            `,
        },
      ],
      model: "claude-3-opus-20240229",
    });

    // Parse the response content
    const textResponse = (response.content[0] as any).text;

    if (!textResponse) {
      throw Boom.badImplementation(
        "Invalid response format from Anthropics API"
      );
    }

    const questions = JSON.parse(textResponse);

    // Validate the structure of the response
    if (
      !Array.isArray(questions) ||
      questions.length !== 10 ||
      !questions.every(
        (q: any) =>
          typeof q.question === "string" &&
          Array.isArray(q.options) &&
          q.options.length === 4 &&
          q.options.some((option: any) => option.isCorrect === true)
      )
    ) {
      throw Boom.badImplementation(
        "Invalid response JSON format from Anthropics API"
      );
    }

    console.log("Generated questions:", questions);

    return questions;
  } catch (error: any) {
    if (Boom.isBoom(error)) {
      throw error;
    }
    if (error.response) {
      throw Boom.badImplementation(
        "Failed to generate questions from Anthropics API",
        error.response.data
      );
    }
    throw Boom.badImplementation(
      "Failed to generate questions from Anthropics API",
      error.message
    );
  }
};

export const regenerateQuestionService = async (
  quizId: number,
  topic: string
) => {
  try {
    // Fetch quiz data
    const quiz: Quiz | null = await Quiz.findByPk(quizId);
    if (!quiz) {
      throw Boom.notFound("Quiz not found");
    }

    // Initialize Anthropics API client
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    // Send the prompt to generate one question
    const response = await client.messages.create({
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `
Generate 1 question for the quiz topic: ${topic}. I want the response in this exact JSON format:
{
    "question": "Your question text here",
    "options": [
        { "text": "Option 1", "isCorrect": false },
        { "text": "Option 2", "isCorrect": true },
        { "text": "Option 3", "isCorrect": false },
        { "text": "Option 4", "isCorrect": false }
    ]
}
Do not include any extra details, explanations, or unnecessary text.`,
        },
      ],
      model: "claude-3-opus-20240229",
    });

    // Parse and extract the response
    const textResponse = (response.content[0] as any).text;

    if (!textResponse) {
      throw Boom.badImplementation(
        "Invalid response format from Anthropics API"
      );
    }

    // Parse the JSON response
    const questionData = JSON.parse(textResponse);

    // Validate the structure of the response
    if (
      typeof questionData.question !== "string" ||
      !Array.isArray(questionData.options) ||
      questionData.options.length !== 4 ||
      !questionData.options.some((option: any) => option.isCorrect === true)
    ) {
      throw Boom.badImplementation("The response JSON format is invalid");
    }

    console.log("Generated question:", questionData);

    return questionData;
  } catch (error: any) {
    if (Boom.isBoom(error)) {
      throw error;
    }
    if (error.response) {
      throw Boom.badImplementation(
        "Failed to generate questions from Anthropics API",
        error.response.data
      );
    }
    throw Boom.badImplementation(
      "Failed to generate questions from Anthropics API",
      error.message
    );
  }
};




