import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import createHttpError, { isHttpError } from "http-errors";
import session from "express-session";
import env from "./utills/ValidateEnv";
import MongoStore from "connect-mongo";
import generalRoutes from "./routes/generalRoutes";
import productRoutes from "./routes/productRoutes";
import cors from "cors";
import salesLogRoutes from "./routes/salesLogRoutes";
import { authenticationHandler } from "./mildlewares/authenticationMiddleware";
const app = express();

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000,
    },
    rolling: true,
    store: MongoStore.create({
      mongoUrl: env.MONGO_CONNECTION_STRING,
    }),
  })
);
app.use("/api/authentication", generalRoutes);
app.use("/api/product", authenticationHandler, productRoutes);
app.use("/api/saleslog", authenticationHandler, salesLogRoutes);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  let errorMesage = "an unknown error has occured";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMesage = error.message;
  }
  res.status(statusCode).json({ error: errorMesage });
});

app.use((req, res, next) => {
  res.status(404).json("Endpoint not found");
  next(createHttpError(404, "Endpoint not found"));
});

export default app;
