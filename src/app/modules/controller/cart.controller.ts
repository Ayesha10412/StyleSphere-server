import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { CartServices } from "../services/cart.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
const createCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as JwtPayload).userId;
    const cart = await CartServices.addToCart(userId, req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Cart created successfully",
      data: cart,
    });
  },
);
export const CartController={createCart}