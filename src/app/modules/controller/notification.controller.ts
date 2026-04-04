import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { NotificationService } from "../services/notification.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { IQuery } from "../../interfaces/error.types";
const createNotification = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req?.file as JwtPayload).userId;
    const notification = await NotificationService.createNotification(
      userId,
      req.body,
    );
    sendResponse(res, {
      success: true,
      message: "Notification created successfully",
      statusCode: httpStatus.CREATED,
      data: notification,
    });
  },
);
export const getNotification = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req?.file as JwtPayload).userId;
    const notifications = await NotificationService.getNotification(
      userId,
      req.query as IQuery,
    );
    sendResponse(res, {
      success: true,
      message: "Notifications retrieved successfully",
      statusCode: httpStatus.OK,
      data: notifications.data,
      meta: notifications.meta,
    });
  },
);
export const NotificationController = {
  createNotification,
  getNotification,
};
