import dotenv from "dotenv";
import { IUser } from "../models/user.model";
import { Response } from "express";
import { redis } from "./redis";
dotenv.config();

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}

//parse environment variables to integrates with fallback values
const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "5", 10);

const refreshTokenExpire = parseInt(
  process.env.REFRESH_TOKEN_EXPIRE || "3",
  10
);

// Options for cookies
export const accessTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + accessTokenExpire * 3600 * 1000),
  maxAge: accessTokenExpire * 3600 * 1000,
  httpOnly: true,
  sameSite: "lax",
};
export const refreshTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpire * 24 * 3600 * 1000),
  maxAge: refreshTokenExpire * 24 * 3600 * 1000,
  httpOnly: true,
  sameSite: "lax",
};

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();

  // upload session to redis
  redis.set(user._id as string, JSON.stringify(user) as any); // user._id == user.email

  // only set secure to true in production
  if (process.env.NODE_ENV === "production") {
    accessTokenOptions.secure = true;
  }

  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};
