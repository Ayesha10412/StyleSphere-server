import { model, Schema, Types } from "mongoose";
import { IReview } from "../interface/review.interface";

const reviewSchema = new Schema<IReview>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true },
  images: [String],
  sellerReply: { type: String },
  isVerifiedPurchase: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
},{timestamps:true,versionKey:false});
export const Review = model<IReview>("Review", reviewSchema);