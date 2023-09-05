import mongoose from "mongoose";

declare module "express-session" {
  interface SessionData {
    authenticatedId: mongoose.Types.ObjectId;
  }
}
