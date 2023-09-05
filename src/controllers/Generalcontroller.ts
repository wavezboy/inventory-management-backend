import { RequestHandler } from "express";
import userModel from "../models/userModel";
import adminModel from "../models/adminModel";
import storeModel from "../models/storeModel";
import bcrypt from "bcrypt";

import createHttpError from "http-errors";
import mongoose, { Schema } from "mongoose";
import { checkIfItIsDefine } from "../utills/assertIsDefine";

interface getBody {
  accountType: string;
}

export const getAuthenticatedAccount: RequestHandler<
  getBody,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  const accountType = req.params.accountType;
  try {
    if (accountType === "user") {
      const user = await userModel
        .findById(req.session.authenticatedId)
        .select("+email")
        .exec();
      res.status(201).json(user);
    }

    if (accountType === "admin") {
      const admin = await adminModel
        .findById(req.session.authenticatedId)
        .select("+email")
        .exec();
      res.status(201).json(admin);
    }

    if (accountType === "store") {
      const store = await storeModel
        .findById(req.session.authenticatedId)
        .select("+email")
        .exec();
      res.status(201).json(store);
    }
  } catch (error) {
    next();
  }
};

interface signUpBody {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  phoneNumber?: number;
  contactAddress?: string;
  storeName?: string;
  selectedStoreId: Schema.Types.ObjectId;
  selectedAdminId: Schema.Types.ObjectId;
}

export const signUp: RequestHandler<
  getBody,
  unknown,
  signUpBody,
  unknown
> = async (req, res, next) => {
  const {
    email,
    password,
    contactAddress,
    firstName,
    lastName,
    phoneNumber,
    storeName,
    selectedAdminId,
    selectedStoreId,
  } = req.body;

  const accountType = req.params.accountType;

  try {
    if (accountType === "user") {
      checkIfItIsDefine(selectedAdminId);
      checkIfItIsDefine(selectedStoreId);
      if (
        !firstName ||
        !lastName ||
        !email ||
        !password ||
        !contactAddress ||
        !phoneNumber ||
        !selectedStoreId
      ) {
        res.status(500).json("parameter is missing");
        throw createHttpError(500, "parameter is missing");
      }

      const existingEmail = await userModel.findOne({ email: email }).exec();

      if (existingEmail) {
        res
          .status(500)
          .json("a user with the email already exist, login instead");

        throw createHttpError(
          500,
          "a user with email already exist, login instead"
        );
      }

      const passwordHashed = await bcrypt.hash(password, 10);

      const newUser = await userModel.create({
        storeId: selectedStoreId,
        adminId: selectedAdminId,
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: passwordHashed,
        contactAddress: contactAddress,
        phoneNumber: phoneNumber,
      });

      req.session.authenticatedId = newUser._id;

      res.status(201).json(newUser);
    }

    if (accountType === "admin") {
      if (
        !firstName ||
        !lastName ||
        !email ||
        !password ||
        !phoneNumber ||
        !contactAddress
      ) {
        res.status(500).json("parameter missing");
        throw createHttpError(500, "parameter missing");
      }

      const existingEmail = await adminModel.findOne({ email: email }).exec();

      if (existingEmail) {
        res
          .status(500)
          .json(" and admin with email already exist, login instead");
        throw createHttpError(
          500,
          "an admin with email already exist, login instead"
        );
      }

      const passwordHashed = await bcrypt.hash(password, 10);

      const newAdmin = await adminModel.create({
        storeId: selectedStoreId,
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: passwordHashed,
        phoneNumber: phoneNumber,
        contactAddress: contactAddress,
      });

      req.session.authenticatedId = newAdmin._id;

      res.status(201).json(newAdmin);
    }

    if (accountType === "store") {
      if (!storeName || !email || !password) {
        throw createHttpError(500, "parameter missing");
      }

      const existingStoreName = await storeModel
        .findOne({ storeName: storeName })
        .exec();

      if (existingStoreName) {
        throw createHttpError(500, "storeName already existed");
      }

      const existingEmail = await storeModel.findOne({ email: email }).exec();

      if (existingEmail) {
        res
          .status(500)
          .json("a store with that email already existed, login insted");
        throw createHttpError(
          500,
          "a store with that email already existed, login insted"
        );
      }

      const passwordHashed = await bcrypt.hash(password, 10);
      const newStore = await storeModel.create({
        storeName: storeName,
        email: email,
        password: passwordHashed,
      });

      req.session.authenticatedId = newStore._id;

      res.status(201).json(newStore);
    }
  } catch (error) {
    next(error);
  }
};

interface logInBody {
  email: string;
  password: string;
}

export const logIn: RequestHandler<
  getBody,
  unknown,
  logInBody,
  unknown
> = async (req, res, next) => {
  const { email, password } = req.body;
  const accountType = req.params.accountType;

  try {
    if (!email || !password || !accountType) {
      res.status(500).json("parameter missing");
      throw createHttpError(500, "parameter missing");
    }

    if (accountType === "user") {
      const user = await userModel
        .findOne({ email: email })
        .select("+password")
        .exec();

      if (!user) {
        res.status(500).json("user not found");
        throw createHttpError(500, "user not found");
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        res.status(500).json("invalid credentials");
        throw createHttpError(500, "invaalid credentials");
      }

      req.session.authenticatedId = user._id;
      res.status(201).json(user);
    }

    if (accountType === "admin") {
      const admin = await adminModel
        .findOne({ email: email })
        .select("+password")
        .exec();

      if (!admin) {
        res.status(500).json("admin not found");
        throw createHttpError(500, "admin not found");
      }

      const passwordMatch = await bcrypt.compare(password, admin.password);

      if (!passwordMatch) {
        res.status(500).json("invalid credentials");
        throw createHttpError(500, "invaalid credentials");
      }

      req.session.authenticatedId = admin._id;
      res.status(201).json(admin);
    }

    if (accountType === "store") {
      const store = await storeModel
        .findOne({ email: email })
        .select("+password")
        .exec();

      if (!store) {
        res.status(500).json("store not found");
        throw createHttpError(500, "store not found");
      }

      const passwordMatch = await bcrypt.compare(password, store.password);

      if (!passwordMatch) {
        res.status(500).json("invalid credentials");
        throw createHttpError(500, "invaalid credentials");
      }

      req.session.authenticatedId = store._id;
      res.status(201).json(store);
    }
  } catch (error) {
    next(error);
  }
};

export const logOut: RequestHandler = async (req, res, next) => {
  try {
    req.session.destroy((error) => {
      if (error) {
        next(error);
      } else {
        res.sendStatus(200);
      }
    });
  } catch (error) {
    next(error);
  }
};

interface getUsersParams {
  accountId: Schema.Types.ObjectId;
  accountType: string;
}

export const getUsers: RequestHandler<
  getUsersParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  const accountId = req.params.accountId;
  const accountType = req.params.accountType;
  try {
    if (!mongoose.isValidObjectId(accountId)) {
      res.status(500).json("invalid account id");
      throw createHttpError(500, "invalid account id");
    }

    if (accountType === "store") {
      const users = await userModel.find({ storeId: accountId }).exec();

      if (!users) {
        res.status(500).json("no users found");
        throw createHttpError(500, "no users found");
      }
      res.status(201).json(users);
    }

    if (accountType === "admin") {
      const users = await userModel.find({ adminId: accountId }).exec();

      if (!users) {
        res.status(500).json("no users found");
        throw createHttpError(500, "no users found");
      }
      res.status(201).json(users);
    }
  } catch (error) {
    next(error);
  }
};

export const getStores: RequestHandler<
  unknown,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const stores = await storeModel.find({}).exec();
    res.status(201).json(stores);
  } catch (error) {
    next(error);
  }
};
