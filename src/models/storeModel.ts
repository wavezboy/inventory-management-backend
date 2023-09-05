import { InferSchemaType, Schema, model } from "mongoose";

const storeSchema = new Schema(
  {
    storeName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

type store = InferSchemaType<typeof storeSchema>;

export default model<store>("Store", storeSchema);
