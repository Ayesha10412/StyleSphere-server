import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { WishListService } from "../services/wishlist.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
const addWishList = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as JwtPayload).userId;
    const { productId } = req.body;
    const wishListItem = await WishListService.addWishList(userId, productId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      data: wishListItem,
      message: "Item added to wishlist successfully!",
    });
  },
);
const userWishlist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as JwtPayload).userId;
    const wishListItems = await WishListService.userWishlist(userId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      data: wishListItems,
      message: "User wishlist retrieved successfully!",
    });
  },
);
const removeFromWishlist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as JwtPayload).userId;
    const { productId } = req.body;
    const removedItem = await WishListService.removeFromWishlist(
      userId,
      productId,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      data: removedItem,
      message: "Item removed from wishlist successfully!",
    });
  },
);
export const WishListController = {
  addWishList,
  userWishlist,
  removeFromWishlist,
};
