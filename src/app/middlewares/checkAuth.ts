import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/appError";
import httpStatus from "http-status-codes";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/model/user.models";
import { IsActive } from "../modules/interface/user.interface";
export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization || req.cookies.accessToken;
      // console.log(accessToken)
      if (!accessToken) {
        throw new AppError(httpStatus.BAD_GATEWAY, "No token received!");
      }
      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET,
      ) as JwtPayload;
      const isUserExist = await User.findOne({ email: verifiedToken.email });
      if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found!");
      }
      if (
        isUserExist?.isActive === IsActive.BLOCKED ||
        isUserExist?.isActive === IsActive.INACTIVE
      ) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `User is ${isUserExist.isActive}!`,
        );
      }
      if (isUserExist?.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted!");
      }
      // if (!authRoles.includes(verifiedToken.role)) {
      //   throw new AppError(405, "You're not permitted to view this route!");
      // }
      if (authRoles.length && !authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, "You're not permitted to view this route!");
      }
      req.user = verifiedToken;
      next();
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
