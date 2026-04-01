import mongoose from "mongoose";
import AppError from "../../errorHelpers/appError";
import { ROLE } from "../interface/user.interface";
import { User } from "../model/user.models";
import httpStatus from "http-status-codes";
import { Wishlist } from "../model/wishlist.model";
const addWishList = async (userId: string, productId: string) => {
  const user = await User.findById(userId);
  if (!user && user!.role !== ROLE.USER) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only users can add items to wishlist!",
    );
  }
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid product ID.");
  }
  const wishListItem = await Wishlist.updateOne(
    { user: userId, product: productId },
    { $setOnInsert: { user: userId, product: productId } },
    { upsert: true },
  );
  if (!wishListItem) {
    throw new AppError(httpStatus.NOT_FOUND, "No items here.");
  }
  return wishListItem;
};
//get wishlist by user id
const userWishlist = async (userId: string) => {
  const wishListItem = await Wishlist.find({ user: userId });
  if (!wishListItem) {
    throw new AppError(httpStatus.NOT_FOUND, "No items here.");
  }
  return wishListItem;
};
//remove from wishlist
const removeFromWishlist = async (userId: string, productId: string) => {
  const wishListItem = await Wishlist.findOneAndDelete({
    user: userId,
    product: productId,
  });
  if (!wishListItem) {
    throw new AppError(httpStatus.NOT_FOUND, "Not items here!");
  }
  return wishListItem;
};
export const WishListService = {
  addWishList,
  userWishlist,
  removeFromWishlist
};
