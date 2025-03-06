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
import Question from "../models/Question";
import { htmlCodeSnippet } from "../constants/questionData";
import { IGetQuizPayload } from "../interfaces/IQuizHookPayload";
import { IJwt } from "../interfaces/IJwt";
import { getTokenFromHeader, readJwtClaims } from "../utils/jwtUtil";
import User from "../models/User";
import { generateQuiz, generateQuizHooks } from "../services/quizHookService";
import { IAddCampaignPayload } from "../interfaces/ICampaign";
import {
  IQuizTypeformPayload,
  WebScanPayload,
} from "../interfaces/IQuizTypeformPayload";
import {
  createTypeform,
  createTypeformWebhook,
  fetchTypeformResponses,
  generateSerialCode,
} from "../utils/fileHandler";
import WebscanCampaign from "../models/webScanCampaign";
import WebscanOffer from "../models/webScanOffer";
import CompanyDetail from "../models/CompanyDetail";
import sequelize from "../config/db";
import WebscanSubmission from "../models/webScanSubmission";
import { callChatCompletionsAPI } from "../services/aiService";
import { webScanEmailSystemPrompt } from "../prompts/webscanEmailSystemPrompt";
import { webScanEmailUserPrompt } from "../prompts/webscanEmailUserPrompt";
import WebScanCampaignEmail from "../models/WebScanCampaignEmail";
import { v4 as uuidv4 } from "uuid";
import { webscanResultsSystemPrompt } from "../prompts/webscanResultsSystemPrompt";
import { webscanResultsUserPrompt } from "../prompts/webscanResultsUserPrompt";
import QuizSubmission from "../models/quizSubmissions";
import { FREE_LEADS } from "../constants";

export const getQuiz = async (request: Request, h: ResponseToolkit) => {
  const payload = request.payload as IGetQuizPayload;
  const { quizTitle } = payload || "";
  const token = getTokenFromHeader(request);
  const claims = readJwtClaims(token) as IJwt;
  const userId = claims.id;

  if (!quizTitle) {
    return h
      .response({ success: false, message: "Quiz title is required" })
      .code(400);
  }

  const user = await User.findByPk(userId);

  if (!user) {
    return h.response({ success: false, message: "User not found" }).code(404);
  }

  const quiz = await generateQuiz(payload, user);

  const quizPayload = {
    title: quizTitle,
    data: payload,
    questions: [
      ...quiz.questions,
      {
        question: "What's your name?",
      },
      {
        question: "What's your email address?",
      },
      {
        question: "What's your phone number?",
      },
    ],
  };

  return h
    .response({
      success: true,
      message: `Quiz '${quizTitle}' fetched successfully`,
      data: quizPayload,
    })
    .code(200);
};

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

export const regenerateQuizHooks = async (
  request: Request,
  h: ResponseToolkit
) => {
  try {
    const payload = request.payload as IAddCampaignPayload;
    const token = getTokenFromHeader(request);
    const claims = readJwtClaims(token) as IJwt;
    const userId = claims.id;
    const user = await User.findByPk(userId);
    if (!user) {
      return h.response({ message: "User not found" }).code(404);
    }
    const quizHooks = await generateQuizHooks(user, payload);
    return h
      .response({
        message:
          "Campaign created successfully with company and offer details.",
        quizTitles: quizHooks.hooks,
        payload: payload,
        success: true,
      })
      .code(200);
  } catch (err: any) {
    console.error("Error:", err);
    const errors = err?.errors || [];
    const errorMessage = `Type: ${err?.name}, ${errors
      .map((x: any) => x.message)
      .join(", ")}`;
    return h.response({ error: errorMessage }).code(500);
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

export const saveQuestions = async (request: Request, h: ResponseToolkit) => {
  try {
    const { questions } = request.payload as { questions: any[] };
    console.log(questions);
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

export const getQuizByCampaignId = async (
  request: Request,
  h: ResponseToolkit
) => {
  const { campaignId } = request.params;

  try {
    // Fetch quiz by campaignId
    const quiz = await Quiz.findOne({
      where: { campaignId },
      include: [
        {
          model: Question,
          as: "questions",
          attributes: ["id", "question", "options"],
        },
      ],
    });

    if (!quiz) {
      return h
        .response({
          message: `No quiz found for campaignId: ${campaignId}`,
          success: false,
        })
        .code(404);
    }

    return h
      .response({
        message: "Quiz fetched successfully.",
        success: true,
        data: {
          quizId: quiz.id,
          topic: quiz.topic,
          description: quiz.description,
          serialCode: quiz.serialCode,
          questions: quiz.questions.map((question) => ({
            questionId: question.id,
            questionText: question.question,
            options: question.options,
          })),
        },
      })
      .code(200);
  } catch (error: any) {
    console.error("Error fetching quiz:", error);
    return h
      .response({
        message: "Error fetching quiz.",
        error: error.message,
        success: false,
      })
      .code(500);
  }
};

export const createQuizWithTypeForm = async (
  request: Request,
  h: ResponseToolkit
) => {
  try {
    const payload = request.payload as IQuizTypeformPayload;
    const { title, data, questions } = payload;
    const campaignId = data.campaignDetails.campainId;

    const quiz = await Quiz.create({
      topic: title,
      description: title,
      campaignId: campaignId,
      serialCode: `QUIZ-${Date.now()}`,
    });

    const questionPromises = questions.map(async (q) => {
      const formattedOptions = q.options?.map((option) => option.text) || [];

      return Question.create({
        question: q.question,
        type: "text",
        options: formattedOptions,
        quizId: quiz.id,
      });
    });

    await Promise.all(questionPromises);

    return h
      .response({
        success: true,
        message: "Quiz and questions created successfully",
        data: {
          embeddedHtml: htmlCodeSnippet,
          prognosticAiUrl: `https://www.prognosticAi.com?serialCode=${quiz.serialCode}`,
        },
      })
      .code(201);
  } catch (error: any) {
    console.error("Error creating quiz with typeform:", error);
    return h
      .response({
        success: false,
        message: "Failed to create quiz",
        error: error.message,
      })
      .code(500);
  }
};

export const createWebScanQuizWithTypeForm = async (
  request: Request,
  h: ResponseToolkit
) => {
  const transaction = await sequelize.transaction();

  try {
    const payload = request.payload as WebScanPayload;
    const token = getTokenFromHeader(request);
    const claims = readJwtClaims(token) as IJwt;
    const userId = claims.id;
    const primaryCompany = await CompanyDetail.findOne({
      where: {
        userId: userId,
        isPrimary: true,
      },
      transaction,
    });

    if (!primaryCompany) {
      await transaction.rollback();
      return h
        .response({
          success: false,
          message: "No primary company found for the user.",
        })
        .code(404);
    }

    const companyId = primaryCompany.id;
    const serialCode = generateSerialCode();

    const newCampaign = await WebscanCampaign.create(
      {
        campaignName: payload.campaignName,
        testimonial: payload.testimonial,
        companyId: companyId,
      },
      { transaction }
    );

    const offerData = payload.offers.map((offer) => ({
      ...offer,
      campaignId: newCampaign.id,
    }));
    await WebscanOffer.bulkCreate(offerData, {
      transaction,
    });

    const typeformResponse = await createTypeform(
      payload.campaignName,
      newCampaign.id
    );

    const typeformFormId = typeformResponse.id;
    const typeformEmbedUrl = typeformResponse._links.display;

    await createTypeformWebhook(typeformFormId);

    newCampaign.typeFormId = typeformFormId;
    newCampaign.typeFormEmbeddedLink = typeformEmbedUrl;
    await newCampaign.save({ transaction });

    const embedHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Build Your Quiz to Unlock Personalized Marketing</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700&display=swap" rel="stylesheet">
    <style>
    body, html {
    margin: 0;
    padding: 0;
    font-family: 'Montserrat', sans-serif;
    background-color: transparent;
    min-height: 100vh;
    }
    .outer-container {
    width: 100%;
    max-width: 800px;
    margin: 20px auto;
    background-color: transparent;
    position: relative;
    }
    .inner-container {
    background-color: white;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
    background-color: #252525;
    color: white;
    padding: 20px;
    font-size: 24px;
    font-weight: 700;
    text-align: center;
    width: 100%;
    box-sizing: border-box;
    }
    .content {
    height: 500px;
    }
    .content > div {
    height: 100%; 
    }
    .footer {
    position: absolute;
    bottom: -40px;
    right: 0;
    }
    .clients-button {
    display: inline-block;
    background-color: #252525;
    color: white;
    font-size: 12px;
    padding: 5px 10px;
    border-radius: 4px;
    text-decoration: none;
    font-weight: 400;
    }
    </style>
    </head>
    <body>
    <div class="outer-container">
    <div class="inner-container">
    <div class="header">
    Claim Your Free Gift Now
    </div>
    <div class="content">
    <div data-tf-widget="${typeformFormId}" style="width: 100%; height: 100%;"></div>
    </div>
    </div>
    <div class="footer">
    <a href="https://prognostic.ai/" class="prognostic-button" target="_blank">Clients.ai Enabled</a>
    </div>
    </div>
    <script src="https://embed.typeform.com/next/embed.js"></script>
    </body>
    </html>
`;

    await transaction.commit();

    return h
      .response({
        success: true,
        message: "Webscan campaign and Typeform created successfully.",
        data: {
          embeddedHtml: embedHtml,
          prognosticAiUrl: `${typeformEmbedUrl}`,
        },
      })
      .code(201);
  } catch (error: any) {
    console.error("Error creating Webscan campaign and Typeform:", error);
    await transaction.rollback();
    return h
      .response({
        success: false,
        message: "Failed to create Webscan campaign and Typeform.",
        error: error.message,
      })
      .code(500);
  }
};

export const deleteWebScanCampaign = async (
  request: Request,
  h: ResponseToolkit
) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = request.params;

    const campaign = await WebscanCampaign.findOne({
      where: { id: id },
      include: [
        { model: WebscanOffer },
        { model: WebscanSubmission, include: [WebScanCampaignEmail] },
      ],
      transaction,
    });

    if (!campaign) {
      await transaction.rollback();
      return h
        .response({
          success: false,
          message: "Webscan campaign not found.",
        })
        .code(404);
    }

    for (const submission of campaign.webscanSubmissions || []) {
      await WebScanCampaignEmail.destroy({
        where: { webscanSubmissionId: submission.id },
        transaction,
      });
    }

    await WebscanSubmission.destroy({
      where: { webscanCampaignId: campaign.id },
      transaction,
    });

    await WebscanOffer.destroy({
      where: { campaignId: campaign.id },
      transaction,
    });

    await WebscanCampaign.destroy({
      where: { id: campaign.id },
      transaction,
    });

    await transaction.commit();

    return h
      .response({
        success: true,
        message: "Webscan campaign and related data deleted successfully.",
      })
      .code(200);
  } catch (error: any) {
    console.error("Error deleting Webscan campaign:", error);
    await transaction.rollback();
    return h
      .response({
        success: false,
        message: "Failed to delete Webscan campaign.",
        error: error.message,
      })
      .code(500);
  }
};

export const saveTypeFormSubmission = async (
  request: Request,
  h: ResponseToolkit
) => {
  const transaction = await sequelize.transaction();
  try {
    const payload = request.payload as any;

    console.log("webhook", JSON.stringify(payload));
    const form_id = payload.form_response.form_id;
    const answers = payload.form_response.answers;

    const firstName = answers[0].text.split(" ")[0];
    const lastName = answers[0].text.split(" ")[1] || "";
    const email = answers[1].email;
    const website = answers[2].text;

    const campaign = await WebscanCampaign.findOne({
      where: {
        typeFormId: form_id,
      },
    });

    const offer = await WebscanOffer.findOne({
      where: {
        campaignId: campaign?.id,
      },
    });

    if (!campaign || !offer) {
      return h.response({ message: "Campaign or offer not found" }).code(404);
    }

    const company = await CompanyDetail.findByPk(campaign.companyId);
    const userId = company?.userId;
    const user = await User.findByPk(userId);

    if (!user) {
      return h.response({ message: "User not found" }).code(404);
    }

    const submissionData = {
      firstName: answers[0].text.split(" ")[0],
      lastName: answers[0].text.split(" ")[1],
      email: answers[1].email,
      website: answers[2].text,
      typeFormId: form_id,
      webscanCampaignId: campaign.id,
    };

    const submission = await WebscanSubmission.create(submissionData, {
      transaction,
    });

    const systemPrompt = webScanEmailSystemPrompt(
      offer.offerGoal,
      firstName,
      lastName
    );

    let isCharged = false;
    const webscanLeads = await WebscanSubmission.count({
      where: { companyId: company!.id },
    });
    const quizLeads = await QuizSubmission.count({
      where: { companyId: company!.id },
    });

    const totalLeads = webscanLeads + quizLeads;
    FREE_LEADS > totalLeads ? (isCharged = true) : (isCharged = false);

    const webscanSubmission = await WebscanSubmission.create(
      {
        firstName: firstName,
        lastName: lastName,
        email: email,
        website: website,
        webscanCampaignId: campaign.id,
        isCharged: isCharged,
      },
      { transaction }
    );
    const userPrompt = webScanEmailUserPrompt(
      offer.offerGoal,
      firstName,
      offer.targetActionURL,
      offer.createdAt,
      offer.offerName,
      user?.name,
      offer?.primaryBenefits,
      website
    );

    const emailData = await callChatCompletionsAPI(systemPrompt, userPrompt);
    const createEmailPromises = emailData.emails.map(async (email: any) => {
      const webScanCampaignEmailPayload = {
        emailSubject: email.subject,
        emailContent: email.content,
        emailName: email.email,
        submissionSerialCode: uuidv4(),
        recipientEmail: submissionData.email,
        webscanSubmissionId: webscanSubmission.id,
      };
      await WebScanCampaignEmail.create(webScanCampaignEmailPayload, {
        transaction,
      });
    });
    await Promise.all(createEmailPromises);

    await transaction.commit();

    return h.response("success").code(200);
  } catch (error: any) {
    console.error("Error storing typeform submission:", error);
    await transaction.rollback();
    return h
      .response({
        success: false,
        message: "Error storing typeform submission.",
        error: error.message,
      })
      .code(500);
  }
};

export const generateWebScanEmails = async (
  request: Request,
  h: ResponseToolkit
) => {
  const transaction = await sequelize.transaction();
  try {
    const payload = request.payload as {
      email: string;
      website: string;
      firstName: string;
      lastName: string;
      campaignId: number;
    };

    const campaign = await WebscanCampaign.findByPk(payload.campaignId);
    const offer = await WebscanOffer.findOne({
      where: {
        campaignId: payload.campaignId,
      },
    });

    if (!campaign || !offer) {
      return h.response({ message: "Campaign or offer not found" }).code(404);
    }

    const company = await CompanyDetail.findByPk(campaign.companyId);
    const userId = company?.userId;
    const user = await User.findByPk(userId);

    if (!user) {
      return h.response({ message: "User not found" }).code(404);
    }

    const systemPrompt = webScanEmailSystemPrompt(
      offer.offerGoal,
      payload.firstName,
      payload.lastName
    );

    const webscanSubmission = await WebscanSubmission.create(
      {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        website: payload.website,
        webscanCampaignId: campaign.id,
      },
      { transaction }
    );
    const userPrompt = webScanEmailUserPrompt(
      offer.offerGoal,
      payload.firstName,
      offer.targetActionURL,
      offer.createdAt,
      offer.offerName,
      user?.name,
      offer?.primaryBenefits,
      payload.website
    );
    console.log("AI call");
    const emailData = await callChatCompletionsAPI(systemPrompt, userPrompt);

    const createEmailPromises = emailData.emails.map(
      (email: any, index: number) => {
        const getEasternTime = (
          hour: number,
          minute: number,
          dayOffset: number
        ): Date => {
          const now = new Date();
          now.setUTCDate(now.getUTCDate() + dayOffset);
          now.setUTCHours(hour + 5, minute, 0, 0); // Convert Eastern Time to UTC (ET is UTC-5)
          return now;
        };

        let sendDate: Date = new Date(); // Assign a default value to sendDate

        if (index < 6) {
          // Emails 1-6: Sent at 7:30 PM on consecutive days
          sendDate = getEasternTime(19, 30, index + 1);
        } else if (index === 6 || index === 7 || index === 8) {
          // 7th day emails: 9:00 AM, 2:00 PM, and 7:30 PM
          const times = [
            getEasternTime(9, 0, 7),
            getEasternTime(14, 0, 7),
            getEasternTime(19, 30, 7),
          ];
          sendDate = times[index - 6];
        } else if (index === 9) {
          // 10th email: Sent at 7:30 PM on the 8th day
          sendDate = getEasternTime(19, 30, 8);
        }

        const webScanCampaignEmailPayload = {
          emailContent: email.content,
          emailSubject: email.subject,
          emailName: email.email,
          submissionSerialCode: uuidv4(),
          recipientEmail: payload.email,
          webscanSubmissionId: webscanSubmission.id,
          sendDate: sendDate, // Add the calculated send date
        };

        return WebScanCampaignEmail.create(webScanCampaignEmailPayload, {
          transaction,
        });
      }
    );

    await Promise.all(createEmailPromises);
    await transaction.commit();
    return h.response({ message: "Emails generated successfully" }).code(200);
  } catch (error: any) {
    console.error("Error storing typeform submission:", error);
    await transaction.rollback();
    return h
      .response({
        success: false,
        message: "Error storing typeform submission.",
        error: error.message,
      })
      .code(500);
  }
};

export const generateQuizResults = async (
  request: Request,
  h: ResponseToolkit
) => {
  const transaction = await sequelize.transaction();
  try {
    const payload = request.payload as {
      email: string;
      website: string;
      // firstName: string;
      // lastName: string;
      fullName: string;
      campaignId: number;
    };

    const campaign = await WebscanCampaign.findByPk(payload.campaignId);
    const offer = await WebscanOffer.findOne({
      where: {
        campaignId: payload.campaignId,
      },
    });

    if (!campaign || !offer) {
      return h.response({ message: "Campaign or offer not found" }).code(404);
    }

    const company = await CompanyDetail.findByPk(campaign.companyId);
    const userId = company?.userId;
    const user = await User.findByPk(userId);

    if (!user) {
      return h.response({ message: "User not found" }).code(404);
    }

    const systemPrompt = await webscanResultsSystemPrompt(
      company!,
      offer,
      user.name,
      payload
    );
    const userPrompt = await webscanResultsUserPrompt(
      offer,
      payload.fullName.split(" ")[0],
      payload.fullName.split(" ")[1],
      offer.createdAt
    );

    const resultData = await callChatCompletionsAPI(systemPrompt, userPrompt);
    return h.response(successResponse(resultData.results)).code(200);
  } catch (error: any) {
    console.error("Error generating quiz results:", error);
    await transaction.rollback();
    return h
      .response({
        success: false,
        message: "Error generating quiz results.",
        error: error.message,
      })
      .code(500);
  }
};
