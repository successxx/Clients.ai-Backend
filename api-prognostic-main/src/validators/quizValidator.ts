import * as Joi from 'joi';

export const quizSchema = Joi.object({
    quizId: Joi.number().required(),
    companyId: Joi.number().required(),
});
export const createQuizSchema = Joi.object({
    title: Joi.string().required().optional(),
    topic: Joi.string().required(),
    description: Joi.string().required(),
    creationDate: Joi.date().required(),
    campaignId: Joi.number().required(),
});
export const generateQuestionsSchema = Joi.object({
    quizId: Joi.number().required(),
    topic: Joi.string().required(),
});


export const createQuestionSchema = Joi.object({
  questions: Joi.array().items(
    Joi.object({
      question: Joi.string().required(),
      options: Joi.array()
        .items(
          Joi.object({
            text: Joi.string().required(),
            isCorrect: Joi.boolean().required(),
          }).required()
        )
        .min(2)
        .required(),
      quizId: Joi.number().required(),
    }).required()
  ).required(),
});