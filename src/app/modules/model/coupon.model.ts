import { model, Schema } from "mongoose";
import { ICoupon } from "../interface/coupon.interface";

export enum DiscountType {
  PERCENTAGE = "percentage",
  FIXED = "fixed",
}
const couponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true },
    discountType: { type: String, enum: DiscountType, required: true },
    value: { type: Number, required: true },
    minPurchase: { type: Number },
    expiryDate: { type: Date, required: true },
    usageLimit: { type: Number, required: true },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false },
);
export const Coupon = model<ICoupon>("Coupon", couponSchema);
