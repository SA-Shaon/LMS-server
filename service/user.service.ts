import { Response } from "express";
import ErrorHandler from "../utils/ErrorHnadler";
import userModel from "../models/user.model";
import { redis } from "../utils/redis";

// get user info
export const getUserById = async (id: string, res: Response) => {
  const userJson = await redis.get(id);
  if (userJson) {
    const user = JSON.parse(userJson);
    res.status(201).json({
      success: true,
      user,
    });
  }
};
