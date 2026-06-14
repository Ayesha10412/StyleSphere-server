import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { OrderService } from "../services/order.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { IQuery } from "../../interfaces/error.types";
const createOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req?.user as JwtPayload).userId;
    const order = await OrderService.createOrder(userId, req.body);
    // await AuditService.createAudit({
    //   actionType: "ORDER_CREATED",
    //   performedBy: userId,
    //   targetId: order?._id,
    //   targetCollection: "orders",
    //   metadata: { name: order },
    // });
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Order placed successfully.",
      data: order,
    });
  },
);
const allOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const order = await OrderService.allOrder(req.query as IQuery);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "All Order Retrieved successfully.",
      data: order.data,
      meta: order.meta,
    });
  },
);



const myShopOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const sellerId = (req?.user as JwtPayload) 
  const query=req.query as IQuery
  const order = await OrderService.myShopOrder(sellerId?.userId,query)
   sendResponse(res, {
     success: true,
     statusCode: httpStatus.OK,
     message: "Orders retrieved successfully.",
     data: order,
   });
})
const myOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req?.user as JwtPayload) 
  console.log(":",userId)
  const order = await OrderService.myOrder(userId?.userId)
   sendResponse(res, {
     success: true,
     statusCode: httpStatus.OK,
     message: "Orders retrieved successfully.",
     data: order,
   });
})
const orderDetails = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.orderId as string;
    const order = await OrderService.orderDetails(orderId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Order Details Retrieved successfully.",
      data: order,
    });
  },
);
export const orderController = {
  createOrder,
  allOrder,
  orderDetails,
  myOrder,myShopOrder
};
