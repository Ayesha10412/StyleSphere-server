import { model, Schema, Types } from "mongoose";
import { ISellerApplication } from "../interface/seller.interface";

const sellerSchema = new Schema<ISellerApplication>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  motivation: {
    type: String,
    required: true,
  },
  cvLink: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  reviewedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
},{timestamps:true,versionKey:false});
export const Seller = model<ISellerApplication>("Seller", sellerSchema);
