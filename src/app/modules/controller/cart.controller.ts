import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { CartServices } from "../services/cart.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { AuditService } from "../services/audit.service";
const createCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "Please login first to add item into cart.",
      );
    }
    const userId = (req?.user as JwtPayload)?.userId;
    const cart = await CartServices.addToCart(userId, req.body);
      await AuditService.createAudit({
          actionType: "CART_CREATED",
          performedBy: userId,
          targetId: cart._id,
          targetCollection: "cart",
          metadata: { name: cart?.items },
        });
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Cart created successfully",
      data: cart,
    });
  },
);
//update cart
const updateCartItem = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as JwtPayload).userId;
    const { productId, quantity, variant } = req.body;
    const cart = await CartServices.updateCartItem(
      userId,
      productId,
      quantity,
      variant,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Cart item updated successfully",
      data: cart,
    });
  },
);
const removeCartItem=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
const userId = (req.user as JwtPayload).userId;
const {productId,variant}=req.body;
const cart=await CartServices.removeCartItem(userId,productId,variant);
sendResponse(res,{
  success:true,
  statusCode:httpStatus.OK,
  message:"Cart item removed successfully",
  data:cart,
})
})
//clear cart
const clearCart=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
  const userId = (req.user as JwtPayload).userId; 
  const cart=await CartServices.clearCart(userId);
  sendResponse(res,{
    success:true,
    statusCode:httpStatus.OK,
    message:"Cart cleared successfully",
    data:cart,
  })
})
export const CartController = { createCart, updateCartItem, removeCartItem, clearCart };
