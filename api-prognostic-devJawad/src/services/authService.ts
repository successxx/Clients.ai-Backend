import User from "../models/User";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { Op } from "sequelize";

import { boolean } from "joi";

var jwt = require("jsonwebtoken");
var Boom = require("@hapi/boom");
var bcrypt = require("bcryptjs");

export const generateAccessToken = (data: any) => {
  try {
    return jwt.sign(data, process.env.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: process.env.JWT_EXPIRATION,
    });
  } catch (err) {
    throw Boom.badImplementation("terrible implementation", err);
  }
};

export const validateAccessToken = async (
  artifacts: any,
  request: Request,
  h: ResponseToolkit
) => {
  let loggedIn: User | null = await User.findByPk(
    artifacts?.decoded?.payload?.id
  );

  if (!loggedIn) {
    return {
      isValid: false,
      response: h
        .response({ message: "Credentials Invalid, Login again." })
        .code(403),
    };
  }
  if (loggedIn && loggedIn.isDeleted) {
    return {
      isValid: false,
      response: h
        .response({ message: "Your user has been deactivated" })
        .code(403),
    };
  }

  return { isValid: true, credentials: artifacts?.decoded?.payload };
};

export const checkEmailValidity = (email: string) => {
  return new Promise<{ isEmailValid: boolean }>(async (resolve, reject) => {
    let userCount: number = 0;
    userCount = await User.count({
      where: {
        email: email,
      },
    });

    if (userCount > 0) {
      resolve({ isEmailValid: false });
    }

    resolve({ isEmailValid: true });
  });
};
export const checkPhoneNumberValidity = (phoneNumber: string) => {
  return new Promise<{ isPhoneNumberValid: boolean }>(
    async (resolve, reject) => {
      let userCount: number = 0;
      userCount = await User.count({
        where: {
          phoneNumber: phoneNumber,
        },
      });

      if (userCount > 0) {
        resolve({ isPhoneNumberValid: false });
      }

      resolve({ isPhoneNumberValid: true });
    }
  );
};

export const hashPassword = (password: string) => {
  return new Promise<{ passwordHash: string }>(async (resolve, reject) => {
    bcrypt.hash(password, 10).then((hashPassword: any) => {
      resolve({ passwordHash: hashPassword });
    });
  });
};

export const verifyPassword = (password: string, hashed: string) => {
  return new Promise<{ valid: boolean }>(async (resolve, reject) => {
    bcrypt.compare(password, hashed).then((response: boolean) => {
      resolve({ valid: response });
    });
  });
};

export const generateRandomPassword = (minLength: number = 8) => {
  return new Promise<{ password: string }>(async (resolve, reject) => {
    const getRandomChar = (characters: string) => {
      const randomIndex = Math.floor(Math.random() * characters.length);
      return characters[randomIndex];
    };

    const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
    const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const specialChars = "!@#$%^&*()-_=+[]{}|;:,.<>?";

    let password =
      getRandomChar(lowercaseLetters) +
      getRandomChar(uppercaseLetters) +
      getRandomChar(numbers) +
      getRandomChar(specialChars);

    // Fill the rest of the password with random characters
    const remainingLength = minLength - password.length;
    for (let i = 0; i < remainingLength; i++) {
      const allChars =
        lowercaseLetters + uppercaseLetters + numbers + specialChars;
      password += getRandomChar(allChars);
    }

    // Shuffle the password characters
    password = password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    resolve({ password });
  });
};

export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateRefreshToken = (data: any) => {
  try {
    return jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
    });
  } catch (err) {
    throw Boom.badImplementation("terrible implementation", err);
  }
};



export const verifyRefreshToken = (token: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET!,
      { algorithms: ["HS256"] },
      (err: any, tokenDetails: any) => {
        if (err) {
          reject({
            error: true,
            message: "Invalid refresh token",
          });
        } else {
          resolve({
            tokenDetails,
            error: false,
            message: "Valid refresh token",
          });
        }
      }
    );
  });
};
