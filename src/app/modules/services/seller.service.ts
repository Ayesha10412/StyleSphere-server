import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/appError";
import { ISellerApplication } from "../interface/seller.interface";
import { ROLE } from "../interface/user.interface";
import { Seller } from "../model/seller.model";
import { User } from "../model/user.models";
import httpStatus from "http-status-codes";
const applyForSeller = async (userId: string, payload: ISellerApplication) => {
  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }
  if (isUserExist.role !== ROLE.USER) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only normal users can apply for seller",
    );
  }
  const existingApplication = await Seller.findOne({ user: userId });
  if (existingApplication) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You've already applied for seller!",
    );
  }
  const application = await Seller.create({
    ...payload,
    user: userId,
  });
  return application;
};
//get all seller application
const getAllApplication = async () => {
  const applications = await Seller.find()
    .populate("user", "name email role")
    .populate("reviewedBy", "name email");
  return applications;
};
const getMyApplication = async (userId: string) => {
  const application = await Seller.findOne({ user: userId }).populate(
    "user",
    "name email",
  );
  return application;
};
//update application
const reviewApplication = async (
  applicationId: string,
  adminId: string,
  status: "approved" | "rejected",
) => {
  const application = await Seller.findById(applicationId);
  if (!applicationId) {
    throw new AppError(httpStatus.NOT_FOUND, "Application not found!");
  }
  if (application!.status !== "pending") {
    throw new AppError(httpStatus.BAD_REQUEST, "Application already reviewed!");
  }
  application!.status = status;
  application!.reviewedBy = adminId as any;
  await application?.save();
  if (status === "approved") {
    await User.findByIdAndUpdate(application?.user, { role: ROLE.SELLER });
  }
  return application;
};
export const SellerServices = {
  applyForSeller,
  getAllApplication,
  getMyApplication,
  reviewApplication,
};
