import { Op, Sequelize, fn, BaseError } from "sequelize";
import { ServerRoute } from "@hapi/hapi";
import {
  userLoginPayloadValidator,
  userPayloadValidator,
  userParamValidator,
  userProfileImagePayloadValidator,
  otpPayloadValidator,
  refreshTokenSchema,
} from "../validators/userValidator";
import {
  changePassword,
  forgetPassword,
  login,
  logout,
  refreshToken,
  register,
  resendOtp,
  resetPassword,
  updateUserProfile,
  uploadProfileImage,
  verifyOtp,
} from "../controllers/userAuthController";
import { changePasswordValidator } from "../validators/changePasswordValidator";
import { updateProfileValidator, updateUserProfileValidator } from "../validators/updateProfileValidator";

export const UserAuthRoutes: ServerRoute[] = [
  {
    path: "/login",
    method: "POST",
    options: {
      auth: false,
      validate: {
        payload: userLoginPayloadValidator,
      },
    },
    handler: login,
  },
  {
    path: "/register",
    method: "POST",
    handler: register,
    options: {
      notes: "register user",
      auth: false,
      validate: {
        payload: userPayloadValidator,
      },
    },
  },
  {
    path: "/uploadProfileImage",
    method: "POST",
    options: {
      auth: {
        strategies: ["jwt"],
        access: [{ scope: ["user"] }],
      },
      payload: {
        output: "stream",
        parse: true,
        allow: "multipart/form-data",
        multipart: {
          output: "stream",
        },
      },
      validate: {
        payload: userProfileImagePayloadValidator,
      },
    },
    handler: uploadProfileImage,
  },
  {
    path: "/verifyOtp",
    method: "POST",
    options: {
      auth: false,
      validate: {
        payload: otpPayloadValidator,
      },
    },
    handler: verifyOtp,
  },
  {
    path: "/forgotPassword",
    method: "POST",
    options: {
      auth: false,
    },
    handler: forgetPassword,
  },
  {
    path: "/resetPassword",
    method: "POST",
    options: {
      auth: false,
    },
    handler: resetPassword,
  },
  {
    path: "/resendOtp",
    method: "POST",
    options: {
      auth: false,
    },
    handler: resendOtp,
  },
  {
    path: "/refreshToken",
    method: "POST",
    options: {
      auth: {
        strategies: ["jwt"],
        access: [{ scope: ["user"] }],
      },
      validate: {
        payload: refreshTokenSchema,
      },
    },
    handler: refreshToken,
  },
  {
    path: "/logout",
    method: "POST",
    options: {
      auth: {
        strategies: ["jwt"],
        access: [{ scope: ["user"] }],
      },
      validate: {
        payload: refreshTokenSchema,
      },
    },
    handler: logout,
  },
  {
    method: 'POST',
    path: '/user/change-password',
    handler: changePassword,
    options: {
      auth: {
        strategy: 'jwt',
        scope: ['user'] 
      },
      validate: {
        payload: changePasswordValidator,
      },
    },
  },
  {
    method: 'PUT',
    path: '/user/update-profile',
    handler: updateUserProfile,
    options: {
      auth: {
        strategy: 'jwt',
        scope: ['user'] 
      },
      validate: {
        payload: updateUserProfileValidator,
      },
      payload: {
        maxBytes: 209715200,
        parse: true,
        multipart: { output: 'stream' },
      },
    },
  },
];
