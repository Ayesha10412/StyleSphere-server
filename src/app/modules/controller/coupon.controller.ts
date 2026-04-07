import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { CouponService } from "../services/coupon.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { IQuery } from "../../interfaces/error.types";
const createCoupon = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const coupon = await CouponService.createCoupon(req.body);
    sendResponse(res, {
      success: true,
      message: "Coupon created successfully!",
      statusCode: httpStatus.CREATED,
      data: coupon,
    });
  },
);
const allCoupon = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const coupon = await CouponService.allCoupon(req.query as IQuery);
    sendResponse(res, {
      success: true,
      message: "All coupon retrieved successfully!",
      statusCode: httpStatus.OK,
      data: coupon.data,
      meta: coupon.meta,
    });
  },
);
const couponDetails = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const code = req?.params?.code as string;
    const coupon = await CouponService.couponDetails(code);
    sendResponse(res, {
      success: true,
      message: "Coupon details retrieved successfully!",
      statusCode: httpStatus.OK,
      data: coupon,
    });
  },
);
export const CouponController = { createCoupon, allCoupon ,couponDetails};
