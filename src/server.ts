import app from "./app";
import mongoose from "mongoose";
import env from "./utills/ValidateEnv";

mongoose
  .connect(env.MONGO_CONNECTION_STRING)
  .then(() => {
    console.log("mongoose connected");
    app.listen(env.PORT, () => {
      console.log(`connected to ${env.PORT}`);
    });
  })
  .catch(console.error);
