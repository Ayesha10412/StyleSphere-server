import AppError from "../../errorHelpers/appError";
import { IOrder } from "../interface/order.interface";
import { Cart } from "../model/cart.model";
import httpSttaus from "http-status-codes";
import { commissionRate } from "../../interfaces";
import { Order } from "../model/order.model";
import { PaymentService } from "./payment.service";
const createOrder = async (userId: string, payload: IOrder) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart || cart.items.length === 0) {
    throw new AppError(
      httpSttaus.BAD_REQUEST,
      "Cart is empty. Please add items to cart before placing an order.",
    );
  }
  let totalAmount = 0;
  const orderItems = cart.items.map((item) => {
    const subTotal = item.price * item.quantity;
    totalAmount += subTotal;
    return { ...item, subTotal };
  });
  const platformCommission = totalAmount * commissionRate;
  const sellerAmount = totalAmount - platformCommission;
  const order = await Order.create({
    ...payload,
    platformCommission,
    user: userId,
    items: orderItems,
    totalAmount,
    sellerAmount,
  });
  if (!order) {
    throw new AppError(
      httpSttaus.INTERNAL_SERVER_ERROR,
      "Failed to create order. Please try again.",
    );
  }
  const payment = await PaymentService.createPayment(order);
  cart.items = [];
  await cart.save();
  return { order };
};
export const OrderService = {
  createOrder,
};
