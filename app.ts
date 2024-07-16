import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.route";
import morgan from "morgan";

export const app = express();
dotenv.config();

//Body parser
app.use(express.json({ limit: "50mb" }));

//Cookie parser
app.use(cookieParser());

app.use(morgan("dev"));

app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);

// routes
app.use("/api/v1", userRouter);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: "true",
    message: "API is working",
  });
});

// Unknown route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

app.use(ErrorMiddleware);
