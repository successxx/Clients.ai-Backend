var Boom = require("@hapi/boom");
import jwt from "jsonwebtoken";
import { Request } from "@hapi/hapi";

export const readJwtClaims = (token: string) => {
  try {
    // Verify and decode the token
    const secret = process.env.JWT_SECRET as string; // Use the secret key to verify
    const decoded = jwt.verify(token, secret);
    return decoded; // Decoded claims are returned here
  } catch (err: any) {
    console.error("Error decoding JWT:", err.message);
    throw Boom.badImplementation("Invalid token", err);
  }
};

export const getTokenFromHeader = (request: Request) => {
  const authHeader = request.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  throw Boom.badImplementation("Token not found");
};
