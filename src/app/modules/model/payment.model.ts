import { model, Schema } from "mongoose";
import { IPayment } from "../interface/payment.interface";

export enum PAYMENT_STATUS {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  UNPAID = "unpaid",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}
const paymentSchema = new Schema<IPayment>({
  order: {
    type: Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
  invoiceUrl: {
    type: String,
  },
  status: {
    type: String,
    enum: Object.values(PAYMENT_STATUS),
    required: true,
  },
  paymentGatewayData: {
    type: Schema.Types.Mixed,
  },
});
export const Payment = model<IPayment>("Payment", paymentSchema);
