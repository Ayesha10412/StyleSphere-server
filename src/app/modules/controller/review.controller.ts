import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import sendResponse from "../../utils/sendResponse";
import { ReviewService } from "../services/review.service";
import httpStatus from "http-status-codes";
const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req?.user as JwtPayload).userId;
    const { productId, ...rest } = req.body;
    const review = await ReviewService.createReview(userId, {
      productId,
      ...rest,
    });
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Review created successfully",
      data: review,
    });
  },
);
//get review
const getReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const reviews = await ReviewService.getReview();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Reviews retrieved successfully",
      data: reviews,
    });
  },
);
//delete review
const deleteReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { reviewId } = req.params;
    const review = await ReviewService.deleteReview(reviewId as string);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Review deleted successfully",
      data: review,
    });
  },
);

export const ReviewController = {
  createReview,
  getReview,
  deleteReview,
};
