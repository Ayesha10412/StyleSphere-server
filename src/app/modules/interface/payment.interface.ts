import { Types } from "mongoose";

export enum PAYMENT_STATUS {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  UNPAID = "unpaid",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
  COMPLETED = "completed",
}
export interface IPayment {
  order: Types.ObjectId;
  amount: number;
  transactionId: string;
  invoiceUrl?: string;
  status: PAYMENT_STATUS;
  paymentGatewayData?: any;
}
