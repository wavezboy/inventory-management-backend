// import { RequestHandler } from "express";
// import createHttpError from "http-errors";
// import storeModel from "../models/storeModel";
// import bcrypt from "bcrypt";

// export const getAuthenticatedStore: RequestHandler = async (req, res, next) => {
//   try {
//     const store = await storeModel
//       .findById(req.session.storeId)
//       .select("+email")
//       .exec();

//     res.status(201).json(store);
//   } catch (error) {
//     next(error);
//   }
// };

// interface signUpStoreBody {
//   storeName: string;
//   email: string;
//   password: string;
// }

// export const signUpStore: RequestHandler<
//   unknown,
//   unknown,
//   signUpStoreBody,
//   unknown
// > = async (req, res, next) => {
//   const storeName = req.body.storeName;
//   const email = req.body.email;
//   const passwordRaw = req.body.password;
//   try {
//     if (!storeName || !email || !passwordRaw) {
//       throw createHttpError(500, "parameter missing");
//     }

//     const existingStoreName = await storeModel
//       .findOne({ storeName: storeName })
//       .exec();

//     if (existingStoreName) {
//       throw createHttpError(500, "storeName already existed");
//     }

//     const existingEmail = await storeModel.findOne({ email: email }).exec();

//     if (existingEmail) {
//       res
//         .status(500)
//         .json("a store with that email already existed, login insted");
//       throw createHttpError(
//         500,
//         "a store with that email already existed, login insted"
//       );
//     }

//     const passwordHashed = await bcrypt.hash(passwordRaw, 10);
//     const newStore = await storeModel.create({
//       storeName: storeName,
//       email: email,
//       password: passwordHashed,
//     });

//     req.session.storeId = newStore._id;

//     res.status(201).json(newStore);
//   } catch (error) {
//     next(error);
//   }
// };

// interface loginStoreBody {
//   email: string;
//   password: string;
// }

// export const loginStore: RequestHandler<
//   unknown,
//   unknown,
//   loginStoreBody,
//   unknown
// > = async (req, res, next) => {
//   const email = req.body.email;
//   const password = req.body.password;
//   try {
//     if (!email || !password) {
//       throw createHttpError(500, "parameter missing");
//     }

//     const store = await storeModel
//       .findOne({ email: email })
//       .select("+password")
//       .exec();
//     if (!store) {
//       res.status(500).json("store not found");
//       throw createHttpError(500, "store not found");
//     }
//     const passwordMatch = await bcrypt.compare(password, store.password);

//     if (!passwordMatch) {
//       res.status(500).json("invalid credentials");
//       throw createHttpError(500, "invalid credentials");
//     }

//     req.session.storeId = store._id;

//     res.status(201).json(store);
//   } catch (error) {
//     next(error);
//   }
// };

// export const logoutStore: RequestHandler = async (req, res, next) => {
//   req.session.destroy((error) => {
//     if (error) {
//       next(error);
//     } else {
//       res.status(200);
//     }
//   });
// };
