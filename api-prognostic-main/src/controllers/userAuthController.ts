import { Request, ResponseToolkit } from "@hapi/hapi";
import { v4 as uuidv4 } from "uuid";
import User from "../models/User";
import HttpStatus from "http-status-codes";
import {
  generateRandomPassword,
  hashPassword,
  verifyPassword,
  generateAccessToken,
  checkEmailValidity,
  generateOtp,
  checkPhoneNumberValidity,
  generateRefreshToken,
  verifyRefreshToken,
} from "../services/authService";
import { IUpdateUserProfile, IUser } from "../interfaces/IUser";
import { failureResponse, successResponse } from "../utils/apiResponse";
import { uploadFile } from "../utils/fileHandler";
import * as brevo from "@getbrevo/brevo";
import { sendEmailFromService } from "../services/emailService";
import { BaseError, Op } from "sequelize";
import { forgetPasswordValidator } from "../validators/forgetPasswordValidator";
import { resetPasswordValidator } from "../validators/resetPasswordValidator";
import { IForgetPasswordRequest } from "../interfaces/IForgetPasswordRequest";
import { IResetPasswordRequest } from "../interfaces/IResetPasswordRequest";
import RefreshToken from "../models/RefreshToken";
import CompanyDetail from "../models/CompanyDetail";
import CompanyOffer from "../models/CompanyOffer";
import CompanyTestimonial from "../models/CompanyTestimonial";
import { any } from "joi";

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
    if (!isPasswordValid) {
      return h.response({ message: "Invalid password" }).code(400);
    }

    const company = await CompanyDetail.findOne({
      where: { userId: user.id, isPrimary: true },
      attributes: { exclude: ["password"] },
      include: [
        {
          model: CompanyOffer,
          limit: 1,
        },
      ],
    });

    if (!company) {
      return h.response({ message: "Company not found" }).code(404);
    }

    // if (company && company && company.offers.length > 0) {
    //   company.dataValues.offer = company.offers[0];
    //   delete company.dataValues.offers;
    // }

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
        profileImage: user.profileImage
          ? process.env.DOMAIN_NAME + user.profileImage
          : "",
        email: user.email,
      },
      companyDetails: company,
    };

    return h.response(responsePayload).code(200);
  } catch (error: any) {
    return h.response({ message: "Error during login" + error }).code(500);
  }
};

export const register = async (request: Request, h: ResponseToolkit) => {
  try {
    const payload = request.payload as IUser;

    // Check if email is already in use
    const { isEmailValid } = await checkEmailValidity(payload.email);
    if (!isEmailValid) {
      return h
        .response(failureResponse("Email already exists"))
        .code(HttpStatus.BAD_REQUEST);
    }

    // Check if phone number is already in use
    const { isPhoneNumberValid } = await checkPhoneNumberValidity(
      payload.phoneNumber
    );
    if (!isPhoneNumberValid) {
      return h
        .response(failureResponse("Phone number already exists"))
        .code(HttpStatus.BAD_REQUEST);
    }

    // Hash the password
    const { passwordHash } = await hashPassword(payload.password);
    const otp = generateOtp();

    // Create the user
    const user = await User.create({
      name: payload.name,
      email: payload.email,
      password: passwordHash,
      phoneNumber: payload.phoneNumber,
      otp,
    });

    // Send verification email
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = "Verify your email - Prognostic.ai";
    sendSmtpEmail.htmlContent = `Hi ${user.name}, Your OTP is ${otp}`;
    sendSmtpEmail.to = [
      {
        email: user.email,
        name: user.name,
      },
    ];
    await sendEmailFromService(sendSmtpEmail);

    return h
      .response(
        successResponse({ id: user.id }, "An OTP has been sent to your email")
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
  const sendSmtpEmail = new brevo.SendSmtpEmail();
  sendSmtpEmail.subject = "Password Reset - Prognostic.ai";
  sendSmtpEmail.htmlContent = `Hi ${user.name}, <br/> Please click on the button below to reset your password:</br> <button><a href=${frontendUrl}/forget-password/reset?email=${email}&token=${resetToken}>Reset Password</a></button>`;
  sendSmtpEmail.to = [{ email: user.email, name: user.name }];

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

    // Extract passwordHash from the returned object
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
    sendSmtpEmail.subject = "Verify your email - Prognostic.ai";
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
