import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { CouponService } from "../services/coupon.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { IQuery } from "../../interfaces/error.types";
import { AuditService } from "../services/audit.service";
import { JwtPayload } from "jsonwebtoken";
const createCoupon = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req?.user as JwtPayload)?.userId;
    const coupon = await CouponService.createCoupon(req.body);
    await AuditService.createAudit({
      actionType: "COUPON_CREATED",
      performedBy: userId,
      targetId: coupon._id,
      targetCollection: "coupons",
      metadata: { name: coupon?.code },
    });
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
//coupon update
const updateCoupon = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const code = req?.params?.code as string;
    //const userId = (req?.user as JwtPayload)?.userId;
    const coupon = await CouponService.updateCoupon(code, req.body);
    // await AuditService.createAudit({
    //   actionType: "COUPON_UPDATED",
    //   performedBy: userId,
    //   targetId: coupon._id,
    //   targetCollection: "coupons",
    //   metadata: { updatedFields: Object.keys(req.body) },
    // });
    sendResponse(res, {
      success: true,
      message: "Coupon updated successfully!",
      statusCode: httpStatus.OK,
      data: coupon,
    });
  },
);
const deleteCoupon = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const code = req?.params?.code as string;
    //const userId = (req?.user as JwtPayload)?.userId;
    const coupon = await CouponService.deleteCoupon(code);
    // await AuditService.createAudit({
    //   actionType: "COUPON_CREATED",
    //   performedBy: userId,
    //   targetId: coupon._id,
    //   targetCollection: "coupon",
    //   metadata: { name: coupon?.code },
    // });
    sendResponse(res, {
      success: true,
      message: "Coupon deleted successfully!",
      statusCode: httpStatus.OK,
      data: coupon,
    });
  },
);
export const CouponController = {
  createCoupon,
  allCoupon,
  couponDetails,
  deleteCoupon,
  updateCoupon,
};
