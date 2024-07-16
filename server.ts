import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { app } from "./app";
import connectDB from "./utils/db";
dotenv.config();

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

const port = process.env.PORT;

app.listen(port, () => {
  console.log("Listensing to PORT", port);
  connectDB();
});
