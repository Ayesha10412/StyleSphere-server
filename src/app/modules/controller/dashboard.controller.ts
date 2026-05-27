import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { DashboardService } from "../services/dashboard.service";
import httpStatus from "http-status-codes";
const dashboard = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await DashboardService.dashboard();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Dashboard data retrieved successfully.",
      data,
    });
  },
);
export const DashboardController = {
  dashboard,
};
