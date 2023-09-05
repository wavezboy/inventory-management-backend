import { InferSchemaType, Schema, model } from "mongoose";

const salesLogSchema = new Schema(
  {
    storeId: { type: Schema.Types.ObjectId, require: true },
    adminId: { type: Schema.Types.ObjectId, require: true },
    userId: { type: Schema.Types.ObjectId, require: true },
    product: { type: String, required: true },
    quantity: { type: Number, required: true },
    salesPricePerOne: { type: Number, required: true },
    totalSalesPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

type salesLog = InferSchemaType<typeof salesLogSchema>;

export default model<salesLog>("salesLog", salesLogSchema);
