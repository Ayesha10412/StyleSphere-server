import { model, Schema } from "mongoose";
import { IStore } from "../interface/store.interface";

const storeSchema = new Schema<IStore>({
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  storeName: { type: String, required: true },
  storeBanner: { type: String },
  storeDescription: { type: String },
  ratingAverage: { type: Number, min: 0, max: 5 },
  totalSales: { type: Number, default: 0 },
  totalRevenue: {
    type: Number,
    default: 0,
  },
  isApproved: { type: Boolean, default: false },
},{timestamps:true,versionKey:false});
export const Store=model<IStore>("Store",storeSchema)