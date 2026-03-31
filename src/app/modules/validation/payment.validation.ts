import z from "zod";

enum PAYMENT_STATUS {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  UNPAID = "unpaid",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
  COMPLETED = "completed",
}
export const createPaymentValidation = z.object({
  amount: z.number().positive("Amount must be a positive number"),
  transactionId: z.string("Transaction ID is required"),
  invoiceUrl: z.string().optional(),
  status: z.enum(
    [
      PAYMENT_STATUS.PENDING,
      PAYMENT_STATUS.PAID,
      PAYMENT_STATUS.FAILED,
      PAYMENT_STATUS.UNPAID,
      PAYMENT_STATUS.CANCELLED,
      PAYMENT_STATUS.REFUNDED,
      PAYMENT_STATUS.COMPLETED,
    ],
    "Invalid payment status",
  ),
  paymentGAtewayData: z.any().optional(),
});
