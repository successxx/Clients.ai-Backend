import { ServerRoute } from "@hapi/hapi";
import {
  generateQuizHook,
  createQuiz,
  generateQuestions,
  regenerateQuestion,
  saveQuestions,
  getQuizByCampaignId,
  getQuiz,
  regenerateQuizHooks,
  createQuizWithTypeForm,
  createWebScanQuizWithTypeForm,
  saveTypeFormSubmission,
  generateWebScanEmails,
  generateQuizResults,
  deleteWebScanCampaign,
} from "../controllers/quizController";
import {
  createQuestionSchema,
  createQuizSchema,
  generateQuestionsSchema,
  quizSchema,
} from "../validators/quizValidator";

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
    path: "/regenerateQuizHooks",
    handler: regenerateQuizHooks,
    options: {
      auth: {
        strategy: "jwt",
        scope: ["user"],
      },
      // validate: {
      //   params: campaignIdSchema,
      // },
    },
  },
  {
    method: "POST",
    path: "/quiz",
    handler: getQuiz,
    options: {
      auth: {
        strategy: "jwt",
        scope: ["user"],
      },
      // validate: {
      //   query: campaignQuerySchema,
      // },
      description: "Get Quiz",
    },
  },
  {
    method: "POST",
    path: "/createQuizWithTypeForm",
    handler: createQuizWithTypeForm,
    options: {
      auth: {
        strategy: "jwt",
        scope: ["user"],
      },
      // validate: {
      //   query: campaignQuerySchema,
      // },
      description: "Generate Quiz with TypeForm",
    },
  },
  {
    method: "POST",
    path: "/createWebscanQuizWithTypeForm",
    handler: createWebScanQuizWithTypeForm,
    options: {
      auth: {
        strategy: "jwt",
        scope: ["user"],
      },
      // validate: {
      //   query: campaignQuerySchema,
      // },
      description: "Generate Web Scan Quiz with TypeForm",
    },
  },
  {
    method: "DELETE",
    path: "/deleteWebscanCampaign/{id}",
    handler: deleteWebScanCampaign,
    options: {
      auth: {
        strategy: "jwt",
        scope: ["user"],
      },
      // validate: {
      //   query: campaignQuerySchema,
      // },
      description: "Delete Web Scan Campaign",
    },
  },
  {
    method: "GET",
    path: "/{id}",
    handler: getQuizByCampaignId,
    options: {
      //   validate: {
      //     payload: quizSchema,
      //   },
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
  },
  {
    method: "POST",
    path: "/webhooks/typeform/form-response",
    handler: saveTypeFormSubmission,
    options: {
      auth: false,
    },
  },
  {
    method: "POST",
    path: "/generateWebScanEmails",
    handler: generateWebScanEmails,
    options: {
      auth: false,
    },
  },
  {
    method: "POST",
    path: "/generateQuizResults",
    handler: generateQuizResults,
    options: {
      auth: false,
    },
  },
];
