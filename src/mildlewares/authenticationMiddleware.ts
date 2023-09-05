import { RequestHandler } from "express";
import createHttpError from "http-errors";

export const authenticationHandler: RequestHandler = (req, res, next) => {
  if (req.session.authenticatedId) {
    next();
  } else {
    res.status(500).json("authentication not available");
    next(createHttpError(401, "authentication not available"));
  }
};
