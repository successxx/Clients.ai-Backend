import { Request, ResponseToolkit } from "@hapi/hapi";
import {
  QuizTopicThroughAnthropic,
  createQuizService,
  generateQuestionsService,
  regenerateQuestionService,
  saveQuestionsService,

} from "../services/quizService";
import Quiz from "../models/Quiz";
import { successResponse } from "../utils/apiResponse";
import { generateQuestionsSchema } from "src/validators/quizValidator";

export const generateQuizHook = async (
  request: Request,
  h: ResponseToolkit
) => {
  const { quizId, companyId } = request.payload as {
    quizId: number;
    companyId: number;
  };

  try {
    // Create a new quiz
    //const newQuiz = await Quiz.create({ topic, companyId });

    // Call the QuizTopicThroughAnthropic function
    const quizTopics = await QuizTopicThroughAnthropic(quizId, companyId);

    return h
      .response(
        successResponse(
          quizTopics,
          "Quiz created and topics fetched successfully"
        )
      )
      .code(201);
  } catch (error) {
    return h.response({ message: "Error creating quiz" }).code(500);
  }
};
export const createQuiz = async (request: Request, h: ResponseToolkit) => {
  try {
    const payload = request.payload as Partial<Quiz>;

    //Pass the validator object to the service function
    const newQuiz = await createQuizService(payload);

    return h
      .response(successResponse(newQuiz, "Quiz created successfully"))
      .code(201);
  } catch (error) {
    return h.response({ message: "Error creating quiz" }).code(500);
  }
};

export const saveQuestions = async (
  request: Request,
  h: ResponseToolkit
) => {
  try {
    const { questions } = request.payload as { questions: any[] };
   console.log(questions)
    const savedQuestions = await saveQuestionsService(questions);
    return h
      .response(
        successResponse(savedQuestions, "Questions saved successfully.")
      )
      .code(201);
  } catch (error) {
    return h.response({ message: "Failed to save questions." }).code(500);
  }
};
export const generateQuestions = async (
  request: Request,
  h: ResponseToolkit
) => {
  try {
    const payload = request.payload as { quizId: number; topic: string };
    const { quizId, topic } = request.payload as {
      quizId: number;
      topic: string;
    };

    // Call the service function and pass the body values
    const questions = await generateQuestionsService(quizId, topic);

    return h
      .response(successResponse(questions, "Questions generated successfully"))
      .code(201);
  } catch (error) {
    return h.response({ message: "Error generating questions" }).code(500);
  }
};
export const regenerateQuestion = async (
  request: Request,
  h: ResponseToolkit
) => {
  try {
    const { quizId, topic } = request.payload as {
      quizId: number;
      topic: string;
    };

    // Call the service function and pass the body values
    const questions = await regenerateQuestionService(quizId, topic);

    return h
      .response(successResponse(questions, "Questions generated successfully"))
      .code(201);
  } catch (error) {
    return h.response({ message: "Error generating questions" }).code(500);
  }
};
