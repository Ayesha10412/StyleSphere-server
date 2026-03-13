import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { IUser } from "../interface/user.interface";
import { JwtPayload } from "jsonwebtoken";
import { SellerServices } from "../services/seller.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
const applyForSeller = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;
    console.log("User:", user)
    const userId = user!.userId;
    const cvLink = (req.file as any)?.path;
    const result = await SellerServices.applyForSeller(userId, {
      ...req.body,
      cvLink,
    });
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Seller application submitted successfully!",
      data: result,
    });
  },
);
const getAllApplication = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await SellerServices.getAllApplication();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Seller applications retrieved successfully!",
      data: result,
    });
  },
);
//get my application
const getMyApplication = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;
    console.log("user:",user)
    const userId = user.userId;
    console.log("userId:",userId)
    const result = await SellerServices.getMyApplication(userId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Application retrieved successfully!",
      data: result,
    });
  },
);
//review application
const reviewApplication = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const admin = req.user as JwtPayload;
    const adminId = admin._id;
    const { id } = req.params;
    const result = await SellerServices.reviewApplication(
      id as string,
      adminId,
      req.body.status,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Application reviewed successfully!",
      data: result,
    });
  },
);
export const SellerController = {
  applyForSeller,
  getAllApplication,
  getMyApplication,
  reviewApplication,
};
