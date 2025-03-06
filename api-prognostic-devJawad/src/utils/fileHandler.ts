import { createWriteStream } from "fs";
import Question from "../models/Question";
import Quiz from "../models/Quiz";
const fs = require("node:fs");
import { v4 as uuidv4 } from "uuid";
import { quizTopics } from "../constants/questionData";
import axios from "axios";
import { BACKEND_URL } from "../constants";

const TYPEFORM_API_URL = "https://api.typeform.com/forms";
const TYPEFORM_API_TOKEN =
  "tfp_BqAkpNT727EGTViwKiBYxQ9cpCiBivXpQWrj9vVXYemU_3srLEy8ubHDVjZ";
const THEMES_API_URL = "https://api.typeform.com/themes";
const WORKSPACES_API_URL = "https://api.typeform.com/workspaces";
const TYPEFORM_RESPONSES_URL = "https://api.typeform.com/forms";

export const uploadFile = async (
  file: any,
  fileName: string,
  subDirectory: string,
  userId: number
) => {
  fileName = uuidv4() + "-" + fileName;
  const folderName = createFolder(subDirectory, userId);
  const filePath = `${folderName}/${fileName}`;
  const relativePath = `/uploads/${subDirectory}/${userId}/${fileName}`;
  const writeStream = createWriteStream(filePath);
  return new Promise((resolve, reject) => {
    file
      .pipe(writeStream)
      .on("finish", () => {
        resolve(relativePath);
      })
      .on("error", (err: any) => {
        reject(err);
      });
  });
};

const createFolder = (subDirectory: string, userId: number) => {
  const folderName = __dirname + `/../uploads/${subDirectory}/${userId}`;
  try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName, { recursive: true });
    }
    return folderName;
  } catch (err) {
    console.error(err);
  }
};

// const generateSerialCode = (): string => {
//   return Math.random().toString(36).substring(2, 10).toUpperCase();
// };

//   campaignId: number
// ): Promise<boolean> => {
//   const quizData = {
//     topic: "Dummy Quiz for Campaign",
//     description: "This is a dummy quiz created for testing purposes.",
//     campaignId,
//     serialCode: generateSerialCode(), // Add generated serial code here
//   };

//   const questionsData = [
//     {
//       question: "What is 2 + 2?",
//       options: [
//         { text: "3", isCorrect: false },
//         { text: "4", isCorrect: true },
//         { text: "5", isCorrect: false },
//         { text: "6", isCorrect: false },
//       ],
//     },
//     {
//       question: "Which is the capital of France?",
//       options: [
//         { text: "Berlin", isCorrect: false },
//         { text: "Madrid", isCorrect: false },
//         { text: "Paris", isCorrect: true },
//         { text: "Rome", isCorrect: false },
//       ],
//     },
//     {
//       question: "What is the color of the sky?",
//       options: [
//         { text: "Blue", isCorrect: true },
//         { text: "Green", isCorrect: false },
//         { text: "Red", isCorrect: false },
//         { text: "Yellow", isCorrect: false },
//       ],
//     },
//     {
//       question: "What is the square root of 16?",
//       options: [
//         { text: "4", isCorrect: true },
//         { text: "5", isCorrect: false },
//         { text: "6", isCorrect: false },
//         { text: "7", isCorrect: false },
//       ],
//     },
//     {
//       question: "Which planet is known as the Red Planet?",
//       options: [
//         { text: "Earth", isCorrect: false },
//         { text: "Mars", isCorrect: true },
//         { text: "Venus", isCorrect: false },
//         { text: "Jupiter", isCorrect: false },
//       ],
//     },
//     {
//       question: "Which gas do plants absorb during photosynthesis?",
//       options: [
//         { text: "Oxygen", isCorrect: false },
//         { text: "Carbon dioxide", isCorrect: true },
//         { text: "Nitrogen", isCorrect: false },
//         { text: "Helium", isCorrect: false },
//       ],
//     },
//     {
//       question: "What is the boiling point of water?",
//       options: [
//         { text: "100°C", isCorrect: true },
//         { text: "50°C", isCorrect: false },
//         { text: "0°C", isCorrect: false },
//         { text: "150°C", isCorrect: false },
//       ],
//     },
//     {
//       question: "Who wrote 'Romeo and Juliet'?",
//       options: [
//         { text: "William Shakespeare", isCorrect: true },
//         { text: "Charles Dickens", isCorrect: false },
//         { text: "Jane Austen", isCorrect: false },
//         { text: "George Orwell", isCorrect: false },
//       ],
//     },
//     {
//       question: "What is the largest mammal?",
//       options: [
//         { text: "Blue Whale", isCorrect: true },
//         { text: "Elephant", isCorrect: false },
//         { text: "Dolphin", isCorrect: false },
//         { text: "Giraffe", isCorrect: false },
//       ],
//     },
//     {
//       question: "Which element has the chemical symbol 'O'?",
//       options: [
//         { text: "Gold", isCorrect: false },
//         { text: "Oxygen", isCorrect: true },
//         { text: "Hydrogen", isCorrect: false },
//         { text: "Nitrogen", isCorrect: false },
//       ],
//     },
//     {
//       question: "Which year did the Titanic sink?",
//       options: [
//         { text: "1912", isCorrect: true },
//         { text: "1920", isCorrect: false },
//         { text: "1905", isCorrect: false },
//         { text: "1918", isCorrect: false },
//       ],
//     },
//     {
//       question: "What's your name?",
//       options: [],
//     },
//     {
//       question: "What's your email address?",
//       options: [],
//     },
//     {
//       question: "What's your phone number?",
//       options: [],
//     },
//   ];

//   try {
//     const quiz = await Quiz.create(quizData);
//     const questions = questionsData.map((question) => ({
//       ...question,
//       quizId: quiz.id,
//     }));

//     await Question.bulkCreate(questions);

//     console.log(
//       `Dummy quiz with questions created for campaignId: ${campaignId}`
//     );
//     return true; // Indicating success
//   } catch (error) {
//     console.error("Error creating dummy quiz:", error);
//     return false; // Indicating failure
//   }
// };

export const generateRandomQuizTitles = (count: number): string[] => {
  const randomTitles: string[] = [];
  while (randomTitles.length < count) {
    const randomIndex = Math.floor(Math.random() * quizTopics.length);
    const selectedTitle = quizTopics[randomIndex];
    if (!randomTitles.includes(selectedTitle)) {
      randomTitles.push(selectedTitle);
    }
  }

  return randomTitles;
};

export const generateSerialCode = (): string => {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
};

export const createTypeform = async (
  campaignName: string,
  campaignId: number
) => {
  try {
    // Step 1: Fetch Workspaces
    const workspacesResponse = await axios.get(WORKSPACES_API_URL, {
      headers: {
        Authorization: `Bearer ${TYPEFORM_API_TOKEN}`,
      },
    });

    const workspaces = workspacesResponse.data.items;

    if (!workspaces || workspaces.length === 0) {
      throw new Error("No workspaces found in your Typeform account.");
    }

    // Step 2: Find the `prognosticAi` workspace
    const prognosticAiWorkspace = workspaces.find(
      (workspace: any) => workspace.name === "prognosticAi"
    );

    if (!prognosticAiWorkspace) {
      throw new Error("Workspace 'prognosticAi' not found.");
    }

    const workspaceId = prognosticAiWorkspace.id;

    // Step 3: Fetch Themes
    const themesResponse = await axios.get(THEMES_API_URL, {
      headers: {
        Authorization: `Bearer ${TYPEFORM_API_TOKEN}`,
      },
    });

    const themes = themesResponse.data.items;

    if (!themes || themes.length === 0) {
      throw new Error("No themes found in your Typeform account.");
    }

    const selectedTheme = themes[0]; // Select the first theme

    // Step 4: Create Form with custom `ref` values
    const formPayload = {
      title: campaignName,
      workspace: {
        href: `https://api.typeform.com/workspaces/${workspaceId}`,
      },
      theme: {
        // href: selectedTheme.href,
        href: "https://api.typeform.com/themes/gwFT9Vlf",
      },
      fields: [
        {
          type: "short_text",
          title: "Full name",
          ref: "fullName", // Custom ref value
          validations: {
            required: true,
          },
        },
        // {
        //   type: "short_text",
        //   title: "Last Name",
        //   ref: "lastName", // Custom ref value
        //   validations: {
        //     required: true,
        //   },
        // },
        {
          type: "email",
          title: "Email Address",
          ref: "email", // Custom ref value
          validations: {
            required: true,
          },
        },
        {
          type: "short_text",
          title: "Website",
          ref: "website", // Custom ref value
          validations: {
            required: true,
          },
        },
      ],
      settings: {
        is_public: true,
        show_progress_bar: false,
        show_typeform_branding: false,
        meta: {
          allow_indexing: false,
        },
        redirect_after_submit_url: `https://app.clients.ai/quiz-results?email={{field:email}}&website={{field:website}}&fullName={{field:fullName}}&campaignId=${campaignId}`,
      },
    };

    const formResponse = await axios.post(TYPEFORM_API_URL, formPayload, {
      headers: {
        Authorization: `Bearer ${TYPEFORM_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    return formResponse.data; // Return Typeform form details
  } catch (error: any) {
    console.error(
      "Error creating Typeform:",
      error.response?.data || error.message
    );
    throw new Error("Failed to create Typeform.");
  }
};

export const fetchTypeformResponses = async (formId: string): Promise<any> => {
  try {
    const response = await axios.get(
      `${TYPEFORM_RESPONSES_URL}/${formId}/responses`,
      {
        headers: {
          Authorization: `Bearer ${TYPEFORM_API_TOKEN}`,
        },
      }
    );

    return response.data; // Return the submissions data
  } catch (error: any) {
    console.error(
      "Error fetching Typeform responses:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch Typeform responses.");
  }
};

export const createTypeformWebhook = async (formId: string) => {
  const url = `https://api.typeform.com/forms/${formId}/webhooks/${formId}`;

  try {
    const webhookData = {
      url: BACKEND_URL + "quizzes/webhooks/typeform/form-response",
      enabled: true,
      verify_ssl: false,
      event_types: {
        form_response: true,
      },
    };
    const response = await axios.put(url, webhookData, {
      headers: {
        Authorization: `Bearer ${TYPEFORM_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Error creating webhook:",
      error.response?.data || error.message
    );
    throw error;
  }
};
