import { Sequelize } from "sequelize-typescript";
import User from "../models/User";
import CompanyDetail from "../models/CompanyDetail";
import CompanyOffer from "../models/CompanyOffer";
import CompanyTestimonial from "../models/CompanyTestimonial";
import RefreshToken from "../models/RefreshToken";
import Invoice from "../models/Invoice";
import Subscription from "../models/Subscription";
import Campaign from "../models/Campaign";
import Question from "../models/Question";
import Quiz from "../models/Quiz";
import Lead from "../models/Lead";
import CompanySMTPConfig from "../models/CompanySMTPConfig";
import Offer from "../models/Offer";
import CampaignDetailsRecord from "../models/CampaignDetailsRecord";
import WebscanCampaign from "../models/webScanCampaign";
import WebscanOffer from "../models/webScanOffer";
import WebscanSubmission from "../models/webScanSubmission";
import WebScanCampaignEmail from "../models/WebScanCampaignEmail";
import QuizCampaign from "../models/quizCampaigns";
import QuizCampaignEmail from "../models/quizCampaignEmail";
import QuizOffer from "../models/quizOffer";
import QuizSubmission from "../models/quizSubmissions";
//import TestModel from "../models/TestModel";

require("dotenv").config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  dialect: "mysql",
  models: [
    User,
    CompanyDetail,
    CompanyOffer,
    CompanyTestimonial,
    CampaignDetailsRecord,
    RefreshToken,
    Invoice,
    Subscription,
    Campaign,
    Quiz,
    Question,
    Lead,
    CompanySMTPConfig,
    WebscanCampaign,
    WebscanOffer,
    Offer,
    WebscanSubmission,
    WebScanCampaignEmail,
    QuizCampaign,
    QuizCampaignEmail,
    QuizOffer,
    QuizSubmission,
  ],
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

sequelize
  .sync({ alter: false })
  .then(() => {
    console.log("*** Database connected ***");
  })
  .catch((err) => {
    console.error("Error connecting database: ", err);
  });

export default sequelize;
