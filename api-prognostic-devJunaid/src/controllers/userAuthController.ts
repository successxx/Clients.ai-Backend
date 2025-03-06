import { Request, ResponseToolkit } from "@hapi/hapi";
import { v4 as uuidv4 } from "uuid";
import User from "../models/User";
import HttpStatus from "http-status-codes";
import {
  hashPassword,
  verifyPassword,
  generateAccessToken,
  checkEmailValidity,
  generateOtp,
  checkPhoneNumberValidity,
  verifyRefreshToken,
} from "../services/authService";
import { IUpdateUserProfile, IUser } from "../interfaces/IUser";
import { failureResponse, successResponse } from "../utils/apiResponse";
import { uploadFile } from "../utils/fileHandler";
import * as brevo from "@getbrevo/brevo";
import { sendEmailFromService } from "../services/emailService";
import { BaseError, col, fn, Op } from "sequelize";
import { forgetPasswordValidator } from "../validators/forgetPasswordValidator";
import { resetPasswordValidator } from "../validators/resetPasswordValidator";
import { IForgetPasswordRequest } from "../interfaces/IForgetPasswordRequest";
import { IResetPasswordRequest } from "../interfaces/IResetPasswordRequest";
import RefreshToken from "../models/RefreshToken";
import CompanyDetail from "../models/CompanyDetail";
import CompanyOffer from "../models/CompanyOffer";
import WebscanCampaign from "../models/webScanCampaign";
import QuizCampaign from "../models/quizCampaigns";
import WebscanSubmission from "../models/webScanSubmission";
import QuizSubmission from "../models/quizSubmissions";
import Invoice from "../models/Invoice";
import Subscription from "../models/Subscription";

export const login = async (request: Request, h: ResponseToolkit) => {
  const { email, password } = request.payload as Partial<User>;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return h.response({ message: "Invalid email" }).code(400);
    }

    const isPasswordValid = await verifyPassword(
      password as string,
      user.password
    );
    if (!isPasswordValid.valid) {
      return h.response({ message: "Invalid password" }).code(400);
    }

    const company = await CompanyDetail.findOne({
      where: { userId: user.id, isPrimary: true },
      attributes: { exclude: ["password"] },
      include: [{ model: CompanyOffer, limit: 1 }],
    });

    const [webscanActiveCount, quizActiveCount] = await Promise.all([
      WebscanCampaign.count({
        where: { status: true, companyId: company?.id },
      }),
      QuizCampaign.count({ where: { status: true, companyId: company?.id } }),
    ]);
    const totalActiveCampaigns = webscanActiveCount + quizActiveCount;

    const [totalWebscanLeads, totalQuizLeads] = await Promise.all([
      WebscanSubmission.count({ where: { companyId: company?.id } }),
      QuizSubmission.count({ where: { companyId: company?.id } }),
    ]);
    const totalLeads = totalWebscanLeads + totalQuizLeads;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const webscanDailyCounts = await WebscanSubmission.findAll({
      attributes: [
        [fn("DAYNAME", col("createdAt")), "day"],
        [fn("COUNT", col("id")), "count"],
      ],
      where: {
        createdAt: { [Op.gte]: sevenDaysAgo },
      },
      group: ["day"],
    });

    const quizDailyCounts = await QuizSubmission.findAll({
      attributes: [
        [fn("DAYNAME", col("createdAt")), "day"],
        [fn("COUNT", col("id")), "count"],
      ],
      where: {
        createdAt: { [Op.gte]: sevenDaysAgo },
      },
      group: ["day"],
    });

    const dailyMap = new Map<string, number>();

    for (const record of webscanDailyCounts) {
      const day = record.getDataValue("day");
      const count = Number(record.getDataValue("count"));
      dailyMap.set(day, (dailyMap.get(day) || 0) + count);
    }

    for (const record of quizDailyCounts) {
      const day = record.getDataValue("day");
      const count = Number(record.getDataValue("count"));
      dailyMap.set(day, (dailyMap.get(day) || 0) + count);
    }

    const weekDays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dailyStats = weekDays.map((day) => ({
      name: day.substring(0, 3),
      leads: dailyMap.get(day) || 0,
    }));

    const tokenPayload = {
      id: user.id,
      email: user.email,
      scope: ["user"],
    };
    const accessToken = generateAccessToken(tokenPayload);

    const responsePayload = {
      token: accessToken,
      user: {
        id: user.id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        isOnboarded: user.isOnboarded,
        profileImage: user.profileImage
          ? process.env.DOMAIN_NAME + user.profileImage
          : "",
        email: user.email,
      },
      companyDetails: company,
      activeCampaigns: totalActiveCampaigns,
      leads: {
        totalLeads,
        dailyStats,
      },
    };

    return h.response(responsePayload).code(200);
  } catch (error: any) {
    return h.response({ message: "Error during login: " + error }).code(500);
  }
};

export const register = async (request: Request, h: ResponseToolkit) => {
  try {
    const payload = request.payload as IUser;

    const { isEmailValid } = await checkEmailValidity(payload.email);
    if (!isEmailValid) {
      return h
        .response(failureResponse("Email already exists"))
        .code(HttpStatus.BAD_REQUEST);
    }

    const { isPhoneNumberValid } = await checkPhoneNumberValidity(
      payload.phoneNumber
    );
    if (!isPhoneNumberValid) {
      return h
        .response(failureResponse("Phone number already exists"))
        .code(HttpStatus.BAD_REQUEST);
    }

    const { passwordHash } = await hashPassword(payload.password);
    const otp = generateOtp();

    const user = await User.create({
      name: payload.name,
      email: payload.email,
      password: passwordHash,
      phoneNumber: payload.phoneNumber,
      otp,
      isOnboarded: false,
    });

    const emailTemplate = `
     <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap" rel="stylesheet" />
    <!--[if !mso]><!-->
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap");
    </style>
    <!--<![endif]-->
    <style>
      * {
        font-family: "Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, Helvetica, Arial, sans-serif;
      }
      .email-container {
        max-width: 500px;
        margin: 0 auto;
      }
    </style>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI',
        Roboto, Helvetica, Arial, sans-serif;
      background-color: #ffffff;
    "
  >
    <div class="email-container" style="background-color: #f0f4f8; max-width: 500px; margin: 0 auto;">
      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        style="background-color: #f0f4f8; padding: 20px 0"
      >
        <tr>
          <td align="center">
            <table
              width="400"
              cellspacing="0"
              cellpadding="0"
              border="0"
              style="
                font-family: 'Montserrat', -apple-system, BlinkMacSystemFont,
                  'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              "
            >
              <tr>
                <td style="padding: 30px; text-align: center">
                  <h1
                    style="
                      font-size: 22px;
                      font-weight: 600;
                      margin: 0;
                      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont,
                        'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                    "
                  >
                    Hi ${user.name},
                  </h1>
                  <p
                    style="
                      font-size: 15px;
                      font-weight: 400;
                      color: #555;
                      margin: 15px 0;
                      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont,
                        'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                    "
                  >
                    Just a friendly reminder to verify your email address by entering the OTP below:
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding: 0 20px">
                  <table
                    width="100%"
                    cellspacing="0"
                    cellpadding="0"
                    border="0"
                    style="
                      background-color: #ffffff;
                      border-radius: 8px;
                      padding: 20px;
                      text-align: center;
                      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    "
                  >
                    <tr>
                      <td>
                        <p
                          style="
                            font-size: 13px;
                            font-weight: 400;
                            color: #666;
                            margin: 0;
                            font-family: 'Montserrat', -apple-system,
                              BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
                              Arial, sans-serif;
                          "
                        >
                          For security reasons, please help us by verifying your email address. Verify within 28 days of first signing up to avoid the deactivation of your account.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 20px 0">
                        <div
                          style="
                            width: auto;
                            padding: 12px 24px;
                            font-size: 20px;
                            font-weight: 600;
                            border: 2px solid #d1d5db;
                            border-radius: 8px;
                            background: #ffffff;
                            color: #333;
                            display: inline-block;
                            font-family: 'Montserrat', -apple-system,
                              BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
                              Arial, sans-serif;
                          "
                        >
                          ${otp}
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td
                  style="
                    padding: 20px;
                    text-align: center;
                    font-size: 12px;
                    color: #9ca3af;
                    font-family: 'Montserrat', -apple-system, BlinkMacSystemFont,
                      'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                  "
                >
                  Copyright © 2024. All Rights Reserved.
                  <br />
                  <strong
                    style="
                      color: #1f2937;
                      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont,
                        'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                    "
                    >Clients.ai</strong
                  >
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>
`;

    const sendSmtpEmail = {
      subject: "Verify your email - Clients.ai",
      htmlContent: emailTemplate,
      to: [
        {
          email: user.email,
          name: user.name,
        },
      ],
    };

    await sendEmailFromService(sendSmtpEmail);

    return h
      .response(
        successResponse({ id: user.id }, "A OTP has been sent to your email")
      )
      .code(HttpStatus.CREATED);
  } catch (error: any) {
    console.error("Registration Error:", error);
    return h.response({ error: "Registration failed" }).code(500);
  }
};

export const verifyOtp = async (request: Request, h: ResponseToolkit) => {
  try {
    const { id, otp } = request.payload as Partial<User>;
    const user = await User.findOne({
      where: { id: id },
    });
    if (!user) {
      return h
        .response({ message: "User not found" })
        .code(HttpStatus.BAD_REQUEST);
    }

    if (user.otp != otp) {
      return h
        .response(failureResponse("The OTP is invalid"))
        .code(HttpStatus.BAD_REQUEST);
    }
    const updatedUser = await user.update({
      otp: "",
      isEmailVerified: true,
    });
    return h
      .response(successResponse("", "OTP verified successfully"))
      .code(HttpStatus.OK);
  } catch (error: any) {
    console.log(error);
    return h.response(error).code(HttpStatus.INTERNAL_SERVER_ERROR);
  }
};

export const uploadProfileImage = async (
  request: Request,
  h: ResponseToolkit
) => {
  try {
    const { id, profileImage } = request.payload as Partial<IUser>;

    const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (
      !allowedMimeTypes.includes(profileImage!.hapi.headers["content-type"])
    ) {
      return h
        .response({
          success: false,
          message: "Only jpeg, jpg, and png files are allowed",
        })
        .code(400);
    }

    const user = await User.findByPk(id);
    if (!user) {
      return h
        .response({ success: false, message: "User not found" })
        .code(404);
    }

    const filePath = await uploadFile(
      profileImage,
      profileImage!.hapi.filename as string,
      "profileImages",
      id!
    );

    await user.update({ profileImage: filePath as string });

    return h
      .response({
        success: true,
        data: { profileImage: filePath },
        message: "Profile image uploaded successfully.",
      })
      .code(201);
  } catch (err: any) {
    console.error(err);
    return h
      .response({
        success: false,
        message: "Failed to upload profile image",
        error: err.message,
      })
      .code(500);
  }
};

export const forgetPassword = async (request: Request, h: ResponseToolkit) => {
  const { error } = forgetPasswordValidator.validate(request.payload);
  if (error) {
    return h.response({ message: error.details[0].message }).code(400);
  }

  const { email } = request.payload as IForgetPasswordRequest;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return h
      .response(failureResponse("Email not found"))
      .code(HttpStatus.BAD_REQUEST);
  }

  const resetToken: string = uuidv4();
  const tokenExpiry: Date = new Date(Date.now() + 3600000);

  await user.update({
    resetPasswordToken: resetToken,
    resetPasswordExpires: tokenExpiry,
  });

  const frontendUrl = process.env.FRONTEND_URL as string;
  const resetLink = `${frontendUrl}/forget-password/reset?email=${email}&token=${resetToken}`;

  const emailTemplate = `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
    <link
      href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap"
      rel="stylesheet"
    />
    <!--[if !mso]><!-->
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap");
    </style>
    <!--<![endif]-->
    <style>
      * {
        font-family: "Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, Helvetica, Arial, sans-serif;
      }
      .email-container {
        max-width: 500px;
        margin: 0 auto;
      }
    </style>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI',
        Roboto, Helvetica, Arial, sans-serif;
      background-color: #ffffff;
    "
  >
    <div
      class="email-container"
      style="background-color: #f0f4f8; max-width: 500px; margin: 0 auto"
    >
      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        style="background-color: #f0f4f8; padding: 20px 0"
      >
        <tr>
          <td align="center">
            <table
              width="400"
              cellspacing="0"
              cellpadding="0"
              border="0"
              style="
                font-family: 'Montserrat', -apple-system, BlinkMacSystemFont,
                  'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              "
            >
              <tr>
                <td style="padding: 30px; text-align: center">
                  <h1
                    style="
                      font-size: 22px;
                      font-weight: 600;
                      margin: 0;
                      font-family: 'Montserrat', -apple-system,
                        BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial,
                        sans-serif;
                    "
                  >
                    Hi ${user.name},
                  </h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 0 20px">
                  <table
                    width="100%"
                    cellspacing="0"
                    cellpadding="0"
                    border="0"
                    style="
                      background-color: #ffffff;
                      border-radius: 8px;
                      padding: 20px;
                      text-align: center;
                      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    "
                  >
                    <tr>
                      <td>
                        <p
                          style="
                            font-size: 13px;
                            font-weight: 400;
                            color: #666;
                            margin: 0;
                            font-family: 'Montserrat', -apple-system,
                              BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
                              Arial, sans-serif;
                          "
                        >
                          We received a request to reset your password. For security, we’ve generated a secure link for you. <br /><br />
                          Click below to set a new password:
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 20px 0">
                        <a
                          href="${resetLink}"
                          style="
                            width: auto;
                            padding: 12px 28px;
                            font-size: 14px;
                            font-weight: 500;
                            border: none;
                            border-radius: 8px;
                            background: #252525;
                            color: #ffffff;
                            display: inline-block;
                            text-decoration: none;
                            cursor: pointer;
                            font-family: 'Montserrat', -apple-system,
                              BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
                              Arial, sans-serif;
                          "
                        >
                          Reset your password
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p
                          style="
                            font-size: 13px;
                            font-weight: 400;
                            color: #666;
                            margin: 0;
                            font-family: 'Montserrat', -apple-system,
                              BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
                              Arial, sans-serif;
                          "
                        >
                          If you didn’t request this, no worries—your account is still secure, and you can ignore this email.<br /><br />
                          Fiat Lux, The Clients.ai Team
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td
                  style="
                    padding: 20px;
                    text-align: center;
                    font-size: 12px;
                    color: #9ca3af;
                    font-family: 'Montserrat', -apple-system, BlinkMacSystemFont,
                      'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                  "
                >
                  Copyright © 2024. All Rights Reserved.
                  <br />
                  <strong
                    style="
                      color: #1f2937;
                      font-family: 'Montserrat', -apple-system,
                        BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial,
                        sans-serif;
                    "
                    >Clients.ai</strong
                  >
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>
`;

  const sendSmtpEmail = {
    subject: "Reset Your Clients.ai Password",
    htmlContent: emailTemplate,
    to: [
      {
        email: user.email,
        name: user.name,
      },
    ],
  };

  await sendEmailFromService(sendSmtpEmail);

  return h
    .response(successResponse("", "Password reset token sent to your email"))
    .code(HttpStatus.OK);
};

export const resetPassword = async (request: Request, h: ResponseToolkit) => {
  const { error } = resetPasswordValidator.validate(request.payload);
  if (error) {
    return h.response({ message: error.details[0].message }).code(400);
  }

  const { email, token, newPassword } =
    request.payload as IResetPasswordRequest;

  const user = await User.findOne({
    where: {
      email,
      resetPasswordToken: token,
      resetPasswordExpires: { [Op.gt]: new Date() },
    },
  });

  if (!user) {
    return h
      .response(failureResponse("Invalid or expired token"))
      .code(HttpStatus.BAD_REQUEST);
  }

  const { passwordHash } = await hashPassword(newPassword);
  await user.update({
    password: passwordHash,
    resetPasswordToken: null,
    resetPasswordExpires: null,
  });

  return h
    .response(successResponse("", "Password reset successfully"))
    .code(HttpStatus.OK);
};

export const changePassword = async (request: Request, h: ResponseToolkit) => {
  const { email, oldPassword, newPassword } = request.payload as {
    email: string;
    oldPassword: string;
    newPassword: string;
  };

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return h.response(failureResponse("User not found")).code(404);
    }

    const isOldPasswordValid = await verifyPassword(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return h.response(failureResponse("Incorrect old password")).code(400);
    }

    const { passwordHash } = await hashPassword(newPassword);
    user.password = passwordHash;
    await user.save();

    return h
      .response(successResponse("Password updated successfully"))
      .code(200);
  } catch (error) {
    console.error("Change password error:", error);
    return h.response(failureResponse("Error updating password")).code(500);
  }
};

export const getBillingHistory = async (
  request: Request,
  h: ResponseToolkit
) => {
  try {
    const userId = request.auth.credentials.id;

    const invoices = await Invoice.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    const subscription = await Subscription.findOne({
      where: { userId, status: true },
      order: [["currentPeriodEnd", "DESC"]],
    });

    const formattedInvoices = invoices.map((invoice) => ({
      id: invoice.id,
      invoice: `#${invoice.stripeInvoiceId} Invoice`,
      amount: `$${invoice.amountPaid.toFixed(2)}`,
      date: new Date(invoice.createdAt).toLocaleDateString("en-US"),
    }));

    let lastBill = null;
    if (invoices.length > 0) {
      const lastInvoice = invoices[0];
      lastBill = {
        amount: `$${lastInvoice.amountPaid.toFixed(2)}`,
        date: new Date(lastInvoice.createdAt).toLocaleDateString("en-US"),
      };
    }

    let nextBill = null;
    if (subscription && lastBill) {
      const nextBillDate = new Date(subscription.currentPeriodEnd);
      nextBillDate.setDate(nextBillDate.getDate() + 1);

      nextBill = {
        amount: lastBill.amount,
        date: nextBillDate.toLocaleDateString("en-US"),
      };
    }

    // Subscription Info
    let subscriptionInfo = {
      subscribedPlan: subscription ? subscription.plan : "No Subscription",
      status: !!subscription,
    };

    return h
      .response({
        billingHistory: formattedInvoices,
        subscription: subscriptionInfo,
        lastBill,
        nextBill,
      })
      .code(200);
  } catch (error) {
    console.error("Error fetching billing history:", error);
    return h.response({ message: "Failed to fetch billing history" }).code(500);
  }
};

export const updateUserProfile = async (
  request: Request,
  h: ResponseToolkit
) => {
  const { id, name, phoneNumber, profileImage } =
    request.payload as IUpdateUserProfile;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return h.response(failureResponse("User not found")).code(404);
    }

    if (phoneNumber && phoneNumber !== user.phoneNumber) {
      const { isPhoneNumberValid } = await checkPhoneNumberValidity(
        phoneNumber
      );
      if (!isPhoneNumberValid) {
        return h
          .response(failureResponse("Phone number already exists"))
          .code(HttpStatus.BAD_REQUEST);
      }
    }

    let profileImagePath: string | undefined;
    if (profileImage) {
      const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (
        !allowedMimeTypes.includes(profileImage.hapi.headers["content-type"])
      ) {
        return h
          .response(
            failureResponse("Only jpeg, jpg, and png files are allowed")
          )
          .code(HttpStatus.BAD_REQUEST);
      }

      // Upload file
      const filePath = await uploadFile(
        profileImage,
        profileImage.hapi.filename,
        "profileImages",
        id
      );
      profileImagePath = filePath as string;
    }

    user.name = name || user.name;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.profileImage = profileImagePath || user.profileImage;

    await user.save();

    return h
      .response(
        successResponse(
          {
            user: {
              id: user.id,
              name: user.name,
              phoneNumber: user.phoneNumber,
              profileImage: user.profileImage
                ? process.env.DOMAIN_NAME + user.profileImage
                : "",
              email: user.email,
            },
          },
          "Profile updated successfully"
        )
      )
      .code(200);
  } catch (error) {
    console.error(error);
    return h.response(failureResponse("Error updating profile")).code(500);
  }
};

export const resendOtp = async (request: Request, h: ResponseToolkit) => {
  try {
    const { id } = request.payload as { id: number };
    const user = await User.findByPk(id);
    if (!user) {
      return h
        .response(failureResponse("User not found"))
        .code(HttpStatus.BAD_REQUEST);
    }
    //save otp
    user.otp = generateOtp();
    await user.save();

    //Send verification email
    let sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = "Verify your email - clients.ai";
    sendSmtpEmail.htmlContent = "Hi " + user.name + ", Your OTP is " + user.otp;
    sendSmtpEmail.to = [
      {
        email: user.email,
        name: user.name,
      },
    ];

    const info = await sendEmailFromService(sendSmtpEmail);

    return h
      .response(successResponse("", "OTP sent to your email"))
      .code(HttpStatus.OK);
  } catch (err: any) {
    const errors = err?.errors as BaseError[];
    if (errors) {
      err.message = `Type: ${err?.name},  ${
        errors && errors.map((x) => x.message).join(", ")
      }`;
    }
    return err;
  }
};

export const refreshToken = async (request: Request, h: ResponseToolkit) => {
  try {
    const { refreshToken } = request.payload as { refreshToken: string };
    const refreshTokenData = await RefreshToken.findOne({
      where: { token: refreshToken },
    });
    if (!refreshTokenData) {
      return h
        .response(failureResponse("Invalid refresh token"))
        .code(HttpStatus.BAD_REQUEST);
    }
    let tokenDetails: any;
    try {
      tokenDetails = await verifyRefreshToken(refreshTokenData.token);
    } catch (error) {
      throw new Error("Invalid refresh token");
    }

    delete tokenDetails.tokenDetails.iat;
    delete tokenDetails.tokenDetails.exp;

    const accessToken = generateAccessToken(tokenDetails.tokenDetails);
    return h.response(successResponse(accessToken)).code(HttpStatus.OK);
  } catch (err: any) {
    const errors = err?.errors as BaseError[];
    if (errors) {
      err.message = `Type: ${err?.name},  ${
        errors && errors.map((x) => x.message).join(", ")
      }`;
    }
    return err;
  }
};

export const logout = async (request: Request, h: ResponseToolkit) => {
  try {
    const { refreshToken } = request.payload as { refreshToken: string };
    const refreshTokenData = await RefreshToken.findOne({
      where: { token: refreshToken },
    });
    if (!refreshTokenData) {
      return h
        .response(successResponse("Logged out successfully"))
        .code(HttpStatus.OK);
    }
    await refreshTokenData.destroy();
    return h
      .response(successResponse("Logged out successfully"))
      .code(HttpStatus.OK);
  } catch (err: any) {
    const errors = err?.errors as BaseError[];
    if (errors) {
      err.message = `Type: ${err?.name},  ${
        errors && errors.map((x) => x.message).join(", ")
      }`;
    }
    return err;
  }
};
