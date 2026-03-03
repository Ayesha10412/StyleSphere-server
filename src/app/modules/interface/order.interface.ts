import { Types } from "mongoose";

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
export interface IOrderItem {
  product: Types.ObjectId;
  seller: Types.ObjectId;
  variant: {
    size: string;
    color: string;
  };
  price: number;
  quantity: number;
  subTotal: number;
}
export interface IOrder {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  platformCommission: number;
  sellerAmount: number;
  coupon?: Types.ObjectId;
  paymentStatus: "pending" | "paid" | "failed";
  paymentMethod: "stripe" | "sslcommerz";
  transactionId?: string;
  status: OrderStatus;
  statusLogs?: {
    status: OrderStatus;
    changedAt: Date;
    changedBy: Types.ObjectId;
  }[];
  shippingAddress: string;
}
