import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { StoreServices } from "../services/store.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { IQuery } from "../../interfaces/error.types";
import { Store } from "../model/store.model";
const createStore = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;
    const userId = user.userId;
    const storeBanner = (req.file as any)?.path;
    const payload = {
      ...req.body,
      ...(storeBanner && { storeBanner }),
    };
    const store = await StoreServices.createStore(userId, payload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
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
    console.log("Seller:", seller);
    const sellerId = seller.userId;
    console.log(sellerId);
    const result = await StoreServices.getMyStore(sellerId);
    console.log(result);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Retrieved my store successfully",
      data: result,
    });
  },
);
//update store
const updateStore = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;
    console.log(user);
    const userId = user.userId;
    const stores = await Store.findOne({ owner: userId });
    console.log("stores:", stores);
    const storeId = stores?._id.toString();
    console.log(storeId);
    const storeBanner = (req.file as any).path;
    const payload = {
      ...req.body,
      ...(storeBanner && { storeBanner }),
    };
    const store = await StoreServices.updateStore(storeId!, userId, payload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Updated store successfully",
      data: store,
    });
  },
);
export const StoreController = {
  createStore,
  getAllStore,
  getMyStore,
  updateStore,
};
