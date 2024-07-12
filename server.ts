import { app } from "./app";
import connectDB from "./utils/db";

const port = process.env.PORT;

app.listen(port, () => {
  console.log("Listensing to PORT", port);
  connectDB();
});
