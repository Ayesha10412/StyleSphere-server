import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { PaymentService } from "../services/payment.service";
import { envVars } from "../../config/env";
const initPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const order = req.params.orderId as string;
    const payment = await PaymentService.initPayment(order);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment initiated successfully",
      data: payment,
    });
  },
);
const successPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as Record<string, string>;
    const result = await PaymentService.successPayment(query);
    // sendResponse(res, {
    //   success: true,
    //   statusCode: httpStatus.OK,
    //   message: "Payment successful",
    //   data: result,
    // });
   return res.redirect(`${envVars.SSL_SUCCESS_FRONTEND_URL}`);
  },
);
//failed payment
const failedPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as Record<string, string>;
    const result = await PaymentService.failedPayment(query);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment failed",
      data: result,
    });
  },
);
//cancelled payment
const cancelledPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as Record<string, string>;
    const result = await PaymentService.cancelledPayment(query);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment cancelled",
      data: result,
    });
  },
);
export const PaymentController = {
  initPayment,
  successPayment,
  failedPayment,
  cancelledPayment,
};
