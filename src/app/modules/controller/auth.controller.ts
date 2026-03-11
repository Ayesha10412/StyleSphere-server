import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import AppError from "../../errorHelpers/appError";
import { AuthServices } from "../services/auth.service";
import httpStatus from "http-status-codes";
import sendResponse from "../../utils/sendResponse";
import { setAuthCookie } from "../../utils/setCookie";
import passport from "passport";
import { createUserTokens } from "../../utils/userTokens";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", async (err: any, user: any, info: any) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(new AppError(401, info.message));
      }
      const userTokens = await createUserTokens(user);
      const { password: pass, ...rest } = user.toObject();
      setAuthCookie(res, userTokens);
      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User logged in successfully!",
        data: {
          accessToken: userTokens.accessToken,
          refreshToken: userTokens.refreshToken,
          user: rest,
        },
      });
    })(req, res, next);
  },
);

const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "No refresh token received from cookies",
      );
    }
    const tokenInfo = await AuthServices.getNewAccessToken(
      refreshToken as string,
    );
    if (!tokenInfo || !tokenInfo.accessToken) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "Failed to generate access token!",
      );
    }
    setAuthCookie(res, tokenInfo);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "New access token retrieved successfully!",
      data: tokenInfo,
    });
  },
);
//logout
const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User logged out successfully!",
      data: null,
    });
  },
);
export const AuthController = {
  getNewAccessToken,
  credentialsLogin,
  logout,
};
