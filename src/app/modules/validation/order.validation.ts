import { Types } from "mongoose";
import z from "zod";

export enum OrderStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
  REJECTED = "rejected",
  COMPLETED = "completed",
}

// ObjectId validator
const objectId = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: "Invalid ObjectId",
});
const orderItemValidation = z.object({
  product: objectId.optional(),
  seller: objectId.optional(),
  variant: z.object({
    size: z.string("Size is required"),
    color: z.string("Color is required"),
  }),
  price: z.number("Price is required"),
  quantity: z.number().min(1, "Quantity must be a positive number"),
  subTotal: z.number("SubTotal is required"),
});

export const createOrderValidation = z.object({
  items: z
    .array(orderItemValidation)
    .min(1, "At least one order item is required"),
  totalAmount: z.number("Total amount is required"),
  platformCommission: z.number("Platform commission is required"),
  sellerAmount: z.number("Seller amount is required"),
  paymentStatus: z.enum(
    ["pending", "paid", "failed"],
    "Invalid payment status",
  ),
  paymentMethod: z.enum(["stripe", "sslcommerz"], "Invalid payment method"),
  coupon: objectId.optional(),

  statusLogs: z
    .array(
      z.object({
        status: z.nativeEnum(OrderStatus, "Invalid order status"),
        changedAt: z.date("Change date is required"),
        changedBy: z.string("Changed by user ID is required"),
      }),
    )
    .optional(),
  transactionId: z.string().optional(),
  shippingAddress: z.object({
    division: z.string(),
    district: z.string(),
    address: z.string(),
  }),
});
