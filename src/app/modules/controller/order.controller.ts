import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { OrderService } from "../services/order.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
const createOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req?.user as JwtPayload).userId;
    const order = await OrderService.createOrder(userId, req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Order placed successfully.",
      data: order,
    });
  },
);
export const orderController = {
  createOrder,
};
