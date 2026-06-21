import AppError from "../../errorHelpers/appError";
import { ISSLCommerz } from "../interface/sslCommerz.interface";
import { Order } from "../model/order.model";
import { Payment } from "../model/payment.model";
import httpStatus from "http-status-codes";
import { SSLService } from "./sslCommerz.service";
import { PAYMENT_STATUS } from "../interface/payment.interface";
import { IOrder } from "../interface/order.interface";
import crypto from "crypto";
import { Cart } from "../model/cart.model";
const createPayment = async (order: IOrder) => {
  const transactionId = `TXN-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;

  const payment = await Payment.create({
    order: order._id,
    amount: order.totalAmount,
    transactionId,
    status: PAYMENT_STATUS.PENDING,
  });

  return payment;
};
const initPayment = async (
  orderId: string,
): Promise<{ paymentUrl: string }> => {
  const payment = await Payment.findOne({ order: orderId });
  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
  }
  const order = await Order.findById(payment.order);
  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }
  const userAddress = (order?.user as any).address;
  const userEmail = (order?.user as any).email;
  const userPhone = (order?.user as any).phone;
  const userName = (order?.user as any).name;

  const sslPayload: ISSLCommerz = {
    address: userAddress,
    email: userEmail,
    phone: userPhone,
    name: userName,
    amount: payment.amount,
    transactionId: payment.transactionId,
  };
  const sslPayment = await SSLService.sslPaymentInit(sslPayload);
  console.log("SSL FULL RESPONSE:", sslPayment);
  if (!sslPayment || !sslPayment.GatewayPageURL) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Failed to initialize payment gateway",
    );
  }
  payment.paymentGatewayData = sslPayment;
  await payment.save();
  return {
    paymentUrl: sslPayment.GatewayPageURL,
  };
};

// const successPayment = async (query: Record<string, string>) => {
//   const session = await Order.startSession();

//   try {
//     session.startTransaction();

//     const payment = await Payment.findOneAndUpdate(
//       { transactionId: query.transactionId },
//       { status: PAYMENT_STATUS.PAID },
//       { new: true, session },
//     );

//     if (!payment) {
//       throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
//     }

//     const order = await Order.findByIdAndUpdate(
//       payment.order,
//       { status: PAYMENT_STATUS.COMPLETED },
//       { new: true, session },
//     );

//     if (!order) {
//       throw new AppError(httpStatus.NOT_FOUND, "Order not found");
//     }

//     // ✅ CLEAR CART HERE (NOW ORDER EXISTS)
//     await Cart.findOneAndUpdate(
//       { user: order.user },
//       {
//         $set: {
//           items: [],
//           totalPrice: 0,
//         },
//       },
//       { session },
//     );

//     await session.commitTransaction();
//     session.endSession();

//     return { success: true, message: "Payment Successful" };
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     throw error;
//   }
// };
//failed payment
const successPayment = async (query: Record<string, string>) => {
  const session = await Order.startSession();

  try {
    session.startTransaction();

    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.PAID },
      { new: true, session },
    );

    if (!updatedPayment) {
      throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
    }

    const order = await Order.findByIdAndUpdate(
      updatedPayment.order,
      {
        paymentStatus: PAYMENT_STATUS.PAID,
        status: "processing",
      },
      { new: true, session },
    );

    if (!order) {
      throw new AppError(httpStatus.NOT_FOUND, "Order not found");
    }

    await session.commitTransaction();
    session.endSession();

    // clear cart AFTER commit
    await Cart.findOneAndUpdate(
      { user: order.user },
      { $set: { items: [], totalPrice: 0 } },
    );

    return { success: true, message: "Payment Successful" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
const failedPayment = async (query: Record<string, string>) => {
  const session = await Order.startSession();
  session.startTransaction();
  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      {
        transactionId: query.transactionId,
      },
      { status: PAYMENT_STATUS.FAILED },
      { new: true, runValidators: true },
    );
    await Order.findByIdAndUpdate(
      updatedPayment?.order,
      { status: PAYMENT_STATUS.FAILED },
      { new: true, runValidators: true },
    );
    await session.commitTransaction();
    session.endSession();
    return { success: true, message: "Payment Failed" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
//cancelled payment
const cancelledPayment = async (query: Record<string, string>) => {
  const session = await Order.startSession();
  session.startTransaction();
  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      {
        transactionId: query.transactionId,
      },
      { status: PAYMENT_STATUS.CANCELLED },
      { new: true, runValidators: true },
    );
    await Order.findByIdAndUpdate(
      updatedPayment?.order,
      { status: PAYMENT_STATUS.CANCELLED },
      { new: true, runValidators: true },
    );
    await session.commitTransaction();
    session.endSession();
    return { success: true, message: "Payment Cancelled" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const PaymentService = {
  initPayment,
  successPayment,
  failedPayment,
  cancelledPayment,
  createPayment,
};
