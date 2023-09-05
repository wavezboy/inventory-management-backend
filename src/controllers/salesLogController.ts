import { RequestHandler } from "express";
import createHttpError from "http-errors";
import salesLogModel from "../models/salesLogModel";
import mongoose from "mongoose";
import { checkIfItIsDefine } from "../utills/assertIsDefine";
import userModel from "../models/userModel";

interface logBody {
  product: string;
  quantity: number;
  salesPricePerOne: number;
  totalSalesPrice: number;
}

export const createLog: RequestHandler<
  unknown,
  unknown,
  logBody,
  unknown
> = async (req, res, next) => {
  const product = req.body.product;
  const quantity = req.body.quantity;
  const salesPricePerOne = req.body.salesPricePerOne;
  const totalSalesPrice = req.body.salesPricePerOne;

  const authenticatedUserId = req.session.authenticatedId;
  try {
    checkIfItIsDefine(authenticatedUserId);

    if (!product || !quantity || !salesPricePerOne || !totalSalesPrice) {
      res.status(500).json("parameter missing");
      throw createHttpError(500, "paraameter is missing");
    }

    const user = await userModel.findById(authenticatedUserId);

    const newSalesLog = await salesLogModel.create({
      storeId: user?.storeId,
      adminId: user?.adminId,
      userId: authenticatedUserId,
      product: product,
      quantity: quantity,
      salesPricePerOne: salesPricePerOne,
      totalSalesPrice: totalSalesPrice,
    });
    console.log(newSalesLog);

    res.status(201).json(newSalesLog);
  } catch (error) {
    console.log(error);

    next(error);
  }
};

interface getBody {
  logId: string;
  accountType: string;
}

export const getLog: RequestHandler<
  getBody,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  const logId = req.params.logId;
  const authenticatedId = req.session.authenticatedId;
  const accountType = req.params.accountType;

  try {
    checkIfItIsDefine(authenticatedId);

    if (!mongoose.isValidObjectId(logId)) {
      res.status(500).json("invalid logId");
      throw createHttpError(500, "invalid logId");
    }

    const salesLog = await salesLogModel.findById(logId).exec();

    if (!salesLog) {
      res.status(500).json("sales log not found");
      throw createHttpError(500, "sales log not found");
    }
    if (accountType === "user") {
      if (salesLog?.userId && !salesLog.userId.equals(authenticatedId)) {
        res.status(500).json("you cannot access this salesLog");
        throw createHttpError(500, "you cannot access this salesLog");
      }
      res.status(201).json(salesLog);
    }
    if (accountType === "admin") {
      if (salesLog?.adminId && !salesLog.adminId.equals(authenticatedId)) {
        res.status(500).json("you cannot access this salesLog");
        throw createHttpError(500, "you cannot access this salesLog");
      }
      res.status(201).json(salesLog);
    }
  } catch (error) {
    next(error);
  }
};

export const getLogs: RequestHandler<
  getBody,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  const authenticatedId = req.session.authenticatedId;
  const accountType = req.params.accountType;

  try {
    checkIfItIsDefine(authenticatedId);

    if (accountType === "user") {
      const salesLog = await salesLogModel
        .find({
          userId: authenticatedId,
        })
        .exec();
      if (!salesLog) {
        res.status(500).json("sales log not found");
        throw createHttpError(500, "sales log not found");
      }

      res.status(201).json(salesLog);
    }
    if (accountType === "admin") {
      const salesLog = await salesLogModel
        .find({
          adminId: authenticatedId,
        })
        .exec();
      if (!salesLog) {
        res.status(500).json("sales log not found");
        throw createHttpError(500, "sales log not found");
      }

      res.status(201).json(salesLog);
    }
  } catch (error) {
    next(error);
  }
};

interface updateLogBody {
  product: string;
  quantity: number;
  salesPricePerOne: number;
  totalSalesPrice: number;
}

export const updateSalesLog: RequestHandler<
  getBody,
  unknown,
  updateLogBody,
  unknown
> = async (req, res, next) => {
  const { product, salesPricePerOne, totalSalesPrice, quantity } = req.body;
  const logId = req.params.logId;
  const authenticatedId = req.session.authenticatedId;
  const accountType = req.params.accountType;

  try {
    checkIfItIsDefine(authenticatedId);

    if (!mongoose.isValidObjectId(logId)) {
      throw createHttpError(400, " invalid prodcuct Id ");
    }

    if (accountType === "user") {
      const salesLog = await salesLogModel.findById(logId).exec();

      if (!salesLog) {
        throw createHttpError(500, "product not found");
      }

      if (salesLog?.userId && !salesLog.userId.equals(authenticatedId)) {
        res.status(500).json("you cannot access this product");
        throw createHttpError(500, "you cannot access this product");
      }

      salesLog.product = product;
      salesLog.salesPricePerOne = salesPricePerOne;
      salesLog.totalSalesPrice = totalSalesPrice;
      salesLog.quantity = quantity;

      const UpdatedsalesLog = await salesLog.save();

      res.status(201).json(UpdatedsalesLog);
    }
  } catch (error) {
    next(error);
  }
};
