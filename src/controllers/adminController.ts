// import { RequestHandler } from "express";
// import createHttpError from "http-errors";
// import adminModel from "../models/adminModel";
// import bcrypt from "bcrypt";
// import { checkIfItIsDefine } from "../utills/assertIsDefine";

// export const getAuthenticatedAdmin: RequestHandler = async (req, res, next) => {
//   try {
//     const admin = await adminModel
//       .findById(req.session.adminId)
//       .select("+email")
//       .exec();
//     res.status(201).json(admin);
//   } catch (error) {
//     next(error);
//   }
// };

// interface signUpBody {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   phoneNumber: number;
//   contactAddress: string;
// }

// export const signUpAdmin: RequestHandler<
//   unknown,
//   unknown,
//   signUpBody,
//   unknown
// > = async (req, res, next) => {
//   const firstName = req.body.firstName;
//   const lastName = req.body.lastName;
//   const email = req.body.email;
//   const passwordRaw = req.body.password;
//   const phoneNumber = req.body.phoneNumber;
//   const contactAddress = req.body.contactAddress;
//   const authenticatedStoreId = req.session.storeId;
//   try {
//     checkIfItIsDefine(authenticatedStoreId);
//     if (
//       !firstName ||
//       !lastName ||
//       !email ||
//       !passwordRaw ||
//       !phoneNumber ||
//       !contactAddress
//     ) {
//       res.status(500).json("parameter missing");
//       throw createHttpError(500, "parameter missing");
//     }

//     const existingEmail = await adminModel.findOne({ email: email }).exec();

//     if (existingEmail) {
//       res
//         .status(500)
//         .json(" and admin with email already exist, login instead");
//       throw createHttpError(
//         500,
//         "an admin with email already exist, login instead"
//       );
//     }

//     const passwordHashed = await bcrypt.hash(passwordRaw, 10);

//     const newAdmin = await adminModel.create({
//       storeId: authenticatedStoreId,
//       firstName: firstName,
//       lastName: lastName,
//       email: email,
//       password: passwordHashed,
//       phoneNumber: phoneNumber,
//       contactAddress: contactAddress,
//     });

//     req.session.adminId = newAdmin._id;

//     res.status(201).json(newAdmin);
//   } catch (error) {
//     next(error);
//   }
// };

// interface loginBody {
//   email: string;
//   password: string;
// }

// export const loginAdmin: RequestHandler<
//   unknown,
//   unknown,
//   loginBody,
//   unknown
// > = async (req, res, next) => {
//   const email = req.body.email;
//   const password = req.body.password;
//   const authenticatedStoreId = req.session.storeId;

//   try {
//     checkIfItIsDefine(authenticatedStoreId);
//     if (!email || !password) {
//       res.status(500).json("parameter is missing");
//       throw createHttpError(500, "parameter is missing");
//     }

//     const admin = await adminModel
//       .findOne({ email: email })
//       .select("+password +storeId")
//       .exec();

//     if (!admin) {
//       res.status(500).json("invalid credentials");
//       throw createHttpError(500, "invalid credentials");
//     }

//     if (admin.storeId && !admin.storeId.equals(authenticatedStoreId)) {
//       res.status(500).json("you cannot access this store");
//       throw createHttpError(500, "you cannot access this store");
//     }

//     const passwordMatch = await bcrypt.compare(password, admin.password);
//     if (!passwordMatch) {
//       res.status(401).json("incorrect password");
//       throw createHttpError(401, "incorrect password");
//     }

//     req.session.adminId = admin._id;

//     res.status(201).json(admin);
//   } catch (error) {
//     next(error);
//   }
// };

// export const logoutAdmin: RequestHandler = async (req, res, next) => {
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
