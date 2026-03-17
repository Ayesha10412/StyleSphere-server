import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { CategoryService } from "../services/category.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { IQuery } from "../../interfaces/error.types";
const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;
    console.log(user)
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
const getAllCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await CategoryService.getAllCategory(req.query as IQuery);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Category data retrieve successfully!",
      data: result,
    });
  },
);
export const CategoryController = {
  createCategory,
  getAllCategory,
};
