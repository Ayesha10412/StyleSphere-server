import AppError from "../../errorHelpers/appError";
import { IReview } from "../interface/review.interface";
import { ROLE } from "../interface/user.interface";
import { Review } from "../model/review.model";
import { User } from "../model/user.models";
import httpStatus from "http-status-codes";
const createReview = async (userId: string, payload: IReview) => {
  const user = await User.findById(userId);
  if (!user || user!.role !== ROLE.USER) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You're not authorized to create a review.",
    );
  }
  const review = await Review.create({ userId, ...payload });
  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, "Failed to create review.");
  }
  return review;
};
//get review
const getReview = async () => {
  const reviews = await Review.find();
  return reviews;
};
//delete review
const deleteReview = async (reviewId: string) => {
  const review = await Review.findByIdAndDelete(reviewId);
  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, "Failed to delete review.");
  }
  return review;
};
export const ReviewService = {
  createReview,
  getReview,
  deleteReview,
};
