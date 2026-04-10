import jwt from "jsonwebtoken";
import { env } from "./env";
import { JwtUserPayload } from "../types/auth";

export const signToken = (payload: JwtUserPayload) => {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: "7d" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, env.jwtSecret) as JwtUserPayload;
};
