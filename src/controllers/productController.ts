import { RequestHandler } from "express";
import productModel from "../models/productModel";
import mongoose from "mongoose";
import createHttpError from "http-errors";
import { checkIfItIsDefine } from "../utills/assertIsDefine";
import userModel from "../models/userModel";
import adminModel from "../models/adminModel";

interface getBody {
  accountType: string;
  productId: string;
}

export const getProduct: RequestHandler<
  getBody,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  const productId = req.params.productId;
  const accountType = req.params.accountType;
  const authenticatedId = req.session.authenticatedId;

  try {
    checkIfItIsDefine(authenticatedId);

    if (!mongoose.isValidObjectId(productId)) {
      throw createHttpError(400, "invalid Id");
    }
    const product = await productModel.findById(productId).exec();

    if (!product) {
      res.status(500).json("product not found");
      throw createHttpError(400, " product not found");
    }

    if (accountType === "user") {
      const user = await userModel.findById(authenticatedId);

      if (product?.storeId && !product.storeId.equals(user!.storeId!)) {
        res.status(500).json("you cannot access this product");
        throw createHttpError(500, "you cannot access this product");
      }
      res.status(201).json(product);
    }
    if (accountType === "admin") {
      const admin = await adminModel.findById(authenticatedId);

      if (product?.storeId && !product.storeId.equals(admin!.storeId!)) {
        res.status(500).json("you cannot access this product");
        throw createHttpError(500, "you cannot access this product");
      }
      res.status(201).json(product);
    }

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const getProducts: RequestHandler<
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
      const user = await userModel.findById(authenticatedId).exec();

      const products = await productModel
        .find({
          storeId: user?.storeId,
        })
        .exec();
      res.status(201).json(products);
    }
    if (accountType === "admin") {
      const admin = await adminModel.findById(authenticatedId).exec();

      const products = await productModel
        .find({
          storeId: admin?.storeId,
        })
        .exec();
      res.status(201).json(products);
    }

    const products = await productModel
      .find({
        storeId: authenticatedId,
      })
      .exec();
    res.status(201).json(products);
  } catch (error) {
    next(error);
  }
};

interface createProductBody {
  name: string;
  details: object;
  manufacturer: string;
  price: number;
  quantity: number;
}

export const createProduct: RequestHandler<
  getBody,
  unknown,
  createProductBody,
  unknown
> = async (req, res, next) => {
  const { details, manufacturer, name, price, quantity } = req.body;
  const authenticatedId = req.session.authenticatedId;
  const accountType = req.params.accountType;

  try {
    checkIfItIsDefine(authenticatedId);

    if (accountType === "user") {
      res.status(500).json("access denied");
      throw createHttpError(500, "access denied");
    }
    if (accountType === "admin") {
      const admin = await adminModel.findById(authenticatedId).exec();

      const newProduct = await productModel.create({
        storeId: admin?.storeId,
        adminId: authenticatedId,
        details: details,
        manufacturer: manufacturer,
        name: name,
        price: price,
        quantity: quantity,
      });
      res.status(201).json(newProduct);
    }

    const newProduct = await productModel.create({
      storeId: authenticatedId,
      details: details,
      manufacturer: manufacturer,
      name: name,
      price: price,
      quantity: quantity,
    });
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct: RequestHandler<
  getBody,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  const productId = req.params.productId;
  const authenticatedId = req.session.authenticatedId;
  const accountType = req.params.accountType;

  try {
    checkIfItIsDefine(authenticatedId);

    if (!mongoose.isValidObjectId(productId)) {
      throw createHttpError(400, "invalid Id");
    }
    if (accountType === "user") {
      res.status(500).json("access denied");
      throw createHttpError(500, "access denied");
    }
    const product = await productModel.findById(productId).exec();

    if (accountType === "admin") {
      const admin = await adminModel.findById(authenticatedId);

      if (product?.adminId && !product.adminId.equals(authenticatedId)) {
        res.status(500).json("you cannot access this product");
        throw createHttpError(500, "you cannot access this product");
      }

      if (product?.storeId && !product.storeId.equals(admin!.storeId!)) {
        res.status(500).json("you cannot access this product");
        throw createHttpError(500, "you cannot access this product");
      }
      await product?.deleteOne();
      res.status(204).json();
    }
    if (accountType === "store") {
      if (product?.storeId && !product.storeId.equals(authenticatedId)) {
        res.status(500).json("you cannot access this product");
        throw createHttpError(500, "you cannot access this product");
      }
      await product?.deleteOne();
      res.status(204).json();
    }
  } catch (error) {
    next(error);
  }
};

interface updateProductBody {
  name: string;
  details: { name: string };
  manufacturer: string;
  price: number;
  quantity: number;
}

export const updateProduct: RequestHandler<
  getBody,
  unknown,
  updateProductBody,
  unknown
> = async (req, res, next) => {
  const { price, manufacturer, name, quantity } = req.body;
  const productId = req.params.productId;
  const authenticatedId = req.session.authenticatedId;
  const accountType = req.params.accountType;

  try {
    checkIfItIsDefine(authenticatedId);

    if (!mongoose.isValidObjectId(productId)) {
      throw createHttpError(400, " invalid prodcuct Id ");
    }

    const product = await productModel.findById(productId).exec();

    if (!product) {
      throw createHttpError(500, "product not found");
    }
    if (accountType === "user") {
      res.status(500).json("access denied");
      throw createHttpError(500, "access denied");
    }

    product.price = price;
    product.manufacturer = manufacturer;
    product.name = name;
    product.quantity = quantity;

    const updatedProduct = await product.save();

    res.status(201).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};
