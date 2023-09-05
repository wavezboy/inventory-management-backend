import { InferSchemaType, Schema, model } from "mongoose";

const adminSchema = new Schema(
  {
    storeId: { type: Schema.Types.ObjectId, require: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    contactAddress: { type: String },
  },
  { timestamps: true }
);

type admin = InferSchemaType<typeof adminSchema>;

export default model<admin>("Admin", adminSchema);
