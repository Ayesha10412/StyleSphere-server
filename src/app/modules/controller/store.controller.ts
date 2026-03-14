import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { StoreServices } from "../services/store.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { IQuery } from "../../interfaces/error.types";
const createStore = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;
    const userId = user.userId;
    const banner = (req.file as any)?.path;
    const store = await StoreServices.createStore(userId, {
      ...req.body,
      banner,
    });
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Store created successfully!",
      data: store,
    });
  },
);
const getAllStore = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const store = await StoreServices.getAllStore(req.query as IQuery);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Retrieved all store successfully",
      data: store.data,
      meta: store.meta,
    });
  },
);
//get my store
const getMyStore = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const seller = req.user as JwtPayload;
    const sellerId = seller.userId;
    const result = await StoreServices.getMyStore(sellerId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Retrieved my store successfully",
      data: result,
    });
  },
);
export const StoreController = { createStore, getAllStore, getMyStore };
