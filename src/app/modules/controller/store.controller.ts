import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { StoreServices } from "../services/store.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
const createStore = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;
    const userId = user.userId;
    const banner = (req.file as any)?.path;
    const store = await StoreServices.createStore(userId,{...req.body, banner});
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Store created successfully!",
      data: store,
    });
  },
);
export const StoreController = { createStore };
