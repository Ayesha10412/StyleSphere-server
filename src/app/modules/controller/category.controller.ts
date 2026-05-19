import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { CategoryService } from "../services/category.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { IQuery } from "../../interfaces/error.types";
import { Category } from "../model/categories.model";
import { User } from "../model/user.models";
import { AuditService } from "../services/audit.service";
const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req?.user as JwtPayload;
    console.log(user);
    const userId = user?.userId;
    const category = await CategoryService.createCategory(userId, req.body);
    // await AuditService.createAudit({
    //   actionType: "CATEGORY_CREATED",
    //   performedBy: userId,
    //   targetId: category._id,
    //   targetCollection: "categories",
    //   metadata: { name: category?.name },
    // });
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
//categoryDetails
const categoryDetails = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    console.log("id:", id);
    const category = await CategoryService.categoryDetails(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Category details retrieved successfully.",
      data: category,
    });
  },
);
//update category
const updateCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;
    const userId = user.userId;
    const categoryId = req.params.id as string;
    const category = await CategoryService.updateCategory(
      categoryId,
      userId,
      req.body,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Category updated successfully.",
      data: category,
    });
  },
);
//delete category
const deleteCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;
    const userId = user.userId;
    const categoryId = req.params.id as string;
    console.log("categoryId:", categoryId);
    const result = await CategoryService.deleteCategory(categoryId, userId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Category is deleted successfully.",
      data: result,
    });
  },
);
export const CategoryController = {
  createCategory,
  getAllCategory,
  categoryDetails,
  updateCategory,
  deleteCategory,
};
