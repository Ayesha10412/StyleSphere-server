import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { UserService } from "../services/user.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { IQuery } from "../../interfaces/error.types";
import { AuditService } from "../services/audit.service";
const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = (req?.user as JwtPayload).userId;
    const user = await UserService.createUser(req.body);
    await AuditService.createAudit({
      actionType: "USER_CREATED",
      performedBy: loggedInUserId, // who did it
      targetId: user._id, // the user created
      targetCollection: "users",
      metadata: { email: user.email },
    });
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User created successfully",
      data: user,
    });
  },
);
///get all user
const getAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await UserService.getAllUser(req.query as IQuery);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Retrieved all user successfully",
      data: users.data,
      meta: users.meta,
    });
  },
);
//update user
const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const verifiedToken = req.user;
    const payload = req.body;
    const user = await UserService.updateUser(
      userId as string,
      payload,
      verifiedToken as JwtPayload,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User updated successfully!",
      data: user,
    });
  },
);
//delete user
const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;

    const decodedToken = req.user;
    const user = await UserService.deleteUser(
      userId as string,
      decodedToken as JwtPayload,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User deleted successfully!",
      data: user,
    });
  },
);
const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const user = await UserService.getMe(decodedToken.userId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User retrieved successfully!",
      data: user,
    });
  },
);
const getSingleUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const user = await UserService.getMe(userId as string);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User retrieved successfully!",
      data: user,
    });
  },
);
export const UserController = {
  createUser,
  getAllUser,
  updateUser,
  deleteUser,
  getMe,
  getSingleUser,
};
