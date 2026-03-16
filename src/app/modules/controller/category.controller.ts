import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { CategoryService } from "../services/category.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;
    const userId = user.userId;
    const category = await CategoryService.createCategory(userId, req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Category created successfully.",
      data: category,
    });
  },
);
export const CategoryController = {
  createCategory,
};
