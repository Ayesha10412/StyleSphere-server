import { model, Schema } from "mongoose";
import { IOrder, IOrderItem } from "../interface/order.interface";

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


const orderItemSchema = new Schema<IOrderItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    variant: {
      size: { type: String, required: true },
      color: { type: String, required: true },
    },

    price: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    subTotal: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);


const statusLogSchema = new Schema(
  {
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      required: true,
    },

    changedAt: {
      type: Date,
      default: Date.now,
    },

    changedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    platformCommission: {
      type: Number,
      required: true,
    },

    sellerAmount: {
      type: Number,
      required: true,
    },

    coupon: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    paymentMethod: {
      type: String,
      enum: ["stripe", "sslcommerz"],
    },

    transactionId: {
      type: String,
    },

    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },

    statusLogs: {
      type: [statusLogSchema],
      default: [],
    },

    shippingAddress: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Order = model<IOrder>("Order", orderSchema);