import AppError from "../../errorHelpers/appError";
import { generateCouponCode } from "../../helpers/generateCouponCode";
import { IQuery } from "../../interfaces/error.types";
import { QueryBuilder } from "../../utils/queryBuilder";
import { ICoupon } from "../interface/coupon.interface";
import { Coupon } from "../model/coupon.model";
import httpStatus from "http-status-codes";
const createCoupon = async (payload: ICoupon) => {
  const code = await generateCouponCode();
  const coupon = await Coupon.create({
    ...payload,
    code,
    usedCount: 0,
    isActive: true,
  });
  if (!coupon) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to create coupon.",
    );
  }
  return coupon;
};
///get all coupon
const allCoupon = async (query: IQuery) => {
  const builder = new QueryBuilder(Coupon.find().lean(), query)
    .paginate()
    .sort()
    .fields()
    .filter()
    .search(["expiryDate isActive"]);
  const data = await builder.build();
  const meta = await builder.getMeta();
  return {
    data,
    meta,
  };
};
const couponDetails = async (code: string) => {
  const couponCode = await Coupon.findOne({ code });
  if (!couponCode) {
    throw new AppError(httpStatus.NOT_FOUND, "Coupon not found");
  }
  return { couponCode };
};
const updateCoupon = async (code: string, payload: ICoupon) => {
  const couponCode = await Coupon.findOne({ code });
  if (!couponCode) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid coupon code.");
  }
  const coupon = await Coupon.findByIdAndUpdate(
    { ...payload },
    {
      new: true,
      runValidators: true,
    },
  );
  if (!coupon) {
    throw new AppError(httpStatus.NOT_FOUND, "Coupon not found");
  }
};
//delete coupon
const deleteCoupon = async (code: string) => {
  const couponCode = await Coupon.findOne({ code });
  if (!couponCode) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid coupon code.");
  }
  const coupon = await Coupon.findByIdAndDelete(code, {
    new: true,
    runValidators: true,
  });
};
export const CouponService = {
  createCoupon,
  allCoupon,
  couponDetails,
  updateCoupon,
  deleteCoupon,
};
