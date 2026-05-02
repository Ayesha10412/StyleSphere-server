import AppError from "../../errorHelpers/appError";
import { IOrder } from "../interface/order.interface";
import { Cart } from "../model/cart.model";
import httpStatus from "http-status-codes";
import { Order } from "../model/order.model";
import { PaymentService } from "./payment.service";
import { QueryBuilder } from "../../utils/queryBuilder";
import { Coupon } from "../model/coupon.model";
import { commissionRate, IQuery } from "../../interfaces/error.types";
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
  let discount = 0;
  let appliedCoupon = null;
  if (payload.coupon) {
    const coupon = await Coupon.findOne({ code: payload.coupon });
    if (!coupon || !coupon.isActive) {
      throw new AppError(httpStatus.NOT_FOUND, "Invalid coupon");
    }
    if (coupon.expiryDate < new Date()) {
      throw new AppError(httpStatus.FORBIDDEN, "Coupon expired!");
    }
    if (coupon.usageLimit <= (coupon.usedCount ?? 0)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Coupon usage limit reached");
    }
    if (coupon.minPurchase && totalAmount < coupon.minPurchase) {
      throw new AppError(httpStatus.BAD_REQUEST, "Minimum purchase not met!");
    }
    if (coupon.discountType === "percentage") {
      discount = (totalAmount * coupon.value) / 100;
    } else {
      discount = coupon.value;
    }
    if (totalAmount < discount) {
      discount = totalAmount;
    }
    appliedCoupon = coupon;
  }
  const finalAmount = totalAmount - discount;
  const platformCommission = finalAmount * commissionRate;
  const sellerAmount = finalAmount - platformCommission;
  const order = await Order.create({
    ...payload,
    platformCommission,
    user: userId,
    items: orderItems,
    totalAmount,
    sellerAmount,
    finalAmount,
    discount,
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
