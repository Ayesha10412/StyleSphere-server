import { is } from "zod/v4/locales";
import AppError from "../../errorHelpers/appError";
import { io } from "../../utils/socket";
import { INotification } from "../interface/notification.interface";
import { User } from "../model/user.models";
import httpStatus from "http-status-codes";
import { Notification } from "../model/notification.model";
import { IQuery } from "../../interfaces/error.types";
import { QueryBuilder } from "../../utils/queryBuilder";
export const sendNotification = (userId: string, data: any) => {
  io.to(userId).emit("notification", data);
};
const createNotification = async (userId: string, payload: INotification) => {
  const userExist = await User.findById(userId);
  if (!userExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  const notification = await Notification.create({
    ...payload,
    user: userId,
    isRead: false,
  });
  if (!notification) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to create notification",
    );
  }
  sendNotification(userId, notification);
};
const getNotification = async (userId: string, query: IQuery) => {
  const builder = new QueryBuilder(
    Notification.find({ user: userId }).lean(),
    query,
  )
    .sort()
    .paginate();
  const notifications = await builder.build();
  const meta = await builder.getMeta();
  return {
    data: notifications,
    meta,
  };
};
export const NotificationService = {
  createNotification,
  getNotification,
};
