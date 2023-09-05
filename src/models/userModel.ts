import { InferSchemaType, Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    storeId: { type: Schema.Types.ObjectId, required: true },
    adminId: { type: Schema.Types.ObjectId, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    contactAddress: { type: String, required: true },
  },
  { timestamps: true }
);

type user = InferSchemaType<typeof userSchema>;

export default model<user>("User", userSchema);
