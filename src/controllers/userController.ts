// import { RequestHandler } from "express";
// import userModel from "../models/userModel";
// import createHttpError from "http-errors";
// import bcrypt from "bcrypt";
// import { checkIfItIsDefine } from "../utills/assertIsDefine";

// export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
//   try {
//     const user = await userModel
//       .findById(req.session.userId)
//       .select("+email")
//       .exec();
//     res.status(201).json(user);
//   } catch (error) {
//     next();
//   }
// };

// interface signUpUserBody {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   phoneNumber: number;
//   contactAddress: string;
// }

// export const signUpUser: RequestHandler<
//   unknown,
//   unknown,
//   signUpUserBody,
//   unknown
// > = async (req, res, next) => {
//   const firstName = req.body.firstName;
//   const lastName = req.body.lastName;
//   const email = req.body.email;
//   const passwordRaw = req.body.password;
//   const phoneNumber = req.body.phoneNumber;
//   const contactAddress = req.body.contactAddress;
//   const authenticatedStoreId = req.session.storeId;
//   const authenticatedAdminId = req.session.adminId;
//   try {
//     checkIfItIsDefine(authenticatedAdminId);
//     checkIfItIsDefine(authenticatedStoreId);
//     if (
//       !firstName ||
//       !lastName ||
//       !email ||
//       !passwordRaw ||
//       !contactAddress ||
//       !phoneNumber
//     ) {
//       res.status(500).json("parameter is missing");
//       throw createHttpError(500, "parameter is missing");
//     }

//     const existingEmail = await userModel.findOne({ email: email }).exec();

//     if (existingEmail) {
//       res
//         .status(500)
//         .json("a user with the email already exist, login instead");

//       throw createHttpError(
//         500,
//         "a user with email already exist, login instead"
//       );
//     }

//     const passwordHashed = await bcrypt.hash(passwordRaw, 10);

//     const newUser = await userModel.create({
//       storeId: authenticatedStoreId,
//       adminId: authenticatedAdminId,
//       firstName: firstName,
//       lastName: lastName,
//       email: email,
//       password: passwordHashed,
//       contactAddress: contactAddress,
//       phoneNumber: phoneNumber,
//     });

//     req.session.userId = newUser._id;

//     res.status(201).json(newUser);
//   } catch (error) {
//     next();
//   }
// };

// interface loginUserBody {
//   email: string;
//   password: string;
// }

// export const loginUser: RequestHandler<
//   unknown,
//   unknown,
//   loginUserBody,
//   unknown
// > = async (req, res, next) => {
//   const email = req.body.email;
//   const password = req.body.password;
//   const authenticatedStoreId = req.session.storeId;
//   const authenticatedAdminId = req.session.adminId;
//   try {
//     checkIfItIsDefine(authenticatedAdminId);
//     checkIfItIsDefine(authenticatedStoreId);

//     if (!email || !password) {
//       res.status(500).json("parameter is missing");
//       throw createHttpError(500, "parameter is missing");
//     }

//     const user = await userModel
//       .findOne({ email: email })
//       .select("+password")
//       .exec();
//     if (!user) {
//       res.status(500).json("invalid credential");
//       throw createHttpError(500, "invalid credential");
//     }

//     if (user?.adminId && !user.adminId.equals(authenticatedAdminId)) {
//       res
//         .status(500)
//         .json("you cannot access this dashboard check with your Admin");
//       throw createHttpError(500, "you cannot access this user");
//     }
//     if (user?.storeId && !user.storeId.equals(authenticatedStoreId)) {
//       res.status(500).json("you cannot access this store");
//       throw createHttpError(500, "you cannot access this store");
//     }

//     const passwordMatch = await bcrypt.compare(password, user.password);

//     if (!passwordMatch) {
//       res.status(401).json("incorrect password");
//       throw createHttpError(401, "incorrect password");
//     }
//     req.session.userId = user._id;
//     res.status(201).json(user);
//   } catch (error) {
//     next(error);
//   }
// };

// export const logoutUser: RequestHandler = async (req, res, next) => {
//   try {
//     req.session.destroy((error) => {
//       if (error) {
//         next(error);
//       } else {
//         res.sendStatus(200);
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };
