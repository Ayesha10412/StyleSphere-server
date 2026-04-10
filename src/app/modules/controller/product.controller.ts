import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { ProductService } from "../services/product.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { IQuery } from "../../interfaces/error.types";
import { AuditService } from "../services/audit.service";
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
    await AuditService.createAudit({
      actionType: "PRODUCT_CREATED",
      performedBy: seller,
      targetId: product._id,
      targetCollection: "products",
      metadata: { name: product?.title },
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
//get product details
const productDetails = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const productId = req.params.id as string;
    const product = await ProductService.productDetails(productId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Product details retrieved successfully.",
      data: product,
    });
  },
);
//update product
const updateProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;
    const userId = user.userId;
    const productId = req.params.id as string;
    const files = (req.files as any) || [];
    const imageUrls = files.map((file: any) => file.path);
    const payload = {
      ...req.body,
      ...(imageUrls.length > 0 && { images: imageUrls }),
    };
    console.log(payload);

    const product = await ProductService.updateProduct(
      productId,
      userId,
      payload,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Product updated successfully.",
      data: product,
    });
  },
);
//delete product
const deleteProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as JwtPayload).userId;
    const productId = req.params.id as string;
    const product = await ProductService.deleteProduct(productId, userId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Product deleted successfully.",
      data: product,
    });
  },
);
export const ProductController = {
  createProduct,
  getAllProduct,
  productDetails,
  updateProduct,
  deleteProduct,
};
