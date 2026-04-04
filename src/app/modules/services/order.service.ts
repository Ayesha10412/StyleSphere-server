import AppError from "../../errorHelpers/appError";
import { IOrder } from "../interface/order.interface";
import { Cart } from "../model/cart.model";
import httpStatus from "http-status-codes";
import { commissionRate } from "../../interfaces";
import { Order } from "../model/order.model";
import { PaymentService } from "./payment.service";
import { IQuery } from "../../interfaces/error.types";
import { QueryBuilder } from "../../utils/queryBuilder";
const createOrder = async (userId: string, payload: IOrder) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart || cart.items.length === 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
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
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to create order. Please try again.",
    );
  }
  const payment = await PaymentService.createPayment(order);

  if (!payment) {
    throw new AppError(httpStatus.BAD_REQUEST, "Payment creation failed");
  }

  cart.items = [];
  return { order, payment };
};
//get all order
const allOrder = async (query: IQuery) => {
  const builder = new QueryBuilder(Order.find().lean(), query)
    .filter()
    .paginate()
    .search(["status"])
    .sort();
  const data = await builder.build();
  const meta = await builder.getMeta();
  return { data, meta };
};
//order details
const orderDetails = async (orderId: string) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found!");
  }
  return order;
};
export const OrderService = {
  createOrder,
  allOrder,
  orderDetails,
};
