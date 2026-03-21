import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { ProductService } from "../services/product.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { IQuery } from "../../interfaces/error.types";
const createProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req?.user as JwtPayload;
    const seller = user?.userId;
    const { category, ...rest } = req.body;
    // console.log(category);
    // console.log(req.body);
    // console.log("FILES:", req.files);

    const files = req.files as any[];
    if (!files || files.length === 0) {
      console.log("No files uploaded");
    }
    // (req.files as any[])?.forEach((file) => {
    //   console.log("FIELD:", file.fieldname);
    // });
    const imageUrls = files.map((file: any) => file.path);
    const product = await ProductService.createProduct(seller, {
      ...rest,
      category,
      images: imageUrls,
    });
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Product created successfully",
      data: product,
    });
  },
);
//get All product
const getAllProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await ProductService.getAllProduct(req.query as IQuery);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Retrieved all product successfully.",
      data: product.data,
      meta: product.meta,
    });
  },
);

export const ProductController = { createProduct, getAllProduct };
