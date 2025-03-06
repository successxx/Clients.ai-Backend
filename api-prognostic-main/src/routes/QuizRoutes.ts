import { ServerRoute } from "@hapi/hapi";
import { generateQuizHook, createQuiz, generateQuestions, regenerateQuestion, saveQuestions } from "../controllers/quizController";
import { createQuestionSchema, createQuizSchema, generateQuestionsSchema, quizSchema } from "../validators/quizValidator";

export const QuizRoutes: ServerRoute[] = [
    {
        method: "POST",
        path: "/generateQuizHook",
        handler: generateQuizHook,
        options: {
            validate: {
                payload: quizSchema,
            },
        },
    },

    {
        method: "POST",
        path: "/createQuiz",
        handler: createQuiz,
        options: {
            validate: {
                payload: createQuizSchema,
            },
        },
    },
    {
        method: "POST",
        path: "/generateQuestions",
        handler: generateQuestions,
        options: {
            validate: {
                payload: generateQuestionsSchema,
            },
        },
    },
    {
        method: "POST",
        path: "/saveMultipleQuestions",
        handler: saveQuestions,
        options: {
            validate: {
                payload: createQuestionSchema,
            },
        },
    },
    {
        method: "POST",
        path: "/regenerateQuestion",
        handler: regenerateQuestion,
        options: {
            validate: {
                payload: generateQuestionsSchema,
            },
        },
    }
];
