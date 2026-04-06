import z from "zod";

export enum DiscountType {
  PERCENTAGE = "percentage",
  FIXED = "fixed",
}
export const createCouponValidation = z.object({
  code: z.string("Coupon code is required"),
  discountType: z.nativeEnum(DiscountType),
  value: z.number("Value is minimum 1tk").min(1),
  minPurchase: z.number().optional(),
  expiryDate: z.string("Date is required."),
  usageLimit: z.number("Usage limit is required"),
  usedCount: z.number().optional(),
  isActive: z.boolean().optional(),
});
export const updateCouponValidation = z.object({
  code: z.string("Coupon code is required").optional(),
  discountType: z.nativeEnum(DiscountType).optional(),
  value: z.number("Value is minimum 1tk").min(1).optional(),
  minPurchase: z.number().optional(),
  expiryDate: z.string("Date is required.").optional(),
  usageLimit: z.number("Usage limit is required").optional(),
  usedCount: z.number().optional(),
  isActive: z.boolean().optional(),
});
