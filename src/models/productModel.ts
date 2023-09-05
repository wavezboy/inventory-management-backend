import { InferSchemaType, Schema, model } from "mongoose";

const prdoductSchema = new Schema(
  {
    storeId: { type: Schema.Types.ObjectId },
    adminId: { type: Schema.Types.ObjectId },

    name: { type: String, required: true },

    manufacturer: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  { timestamps: true }
);

type product = InferSchemaType<typeof prdoductSchema>;

export default model<product>("Product", prdoductSchema);
