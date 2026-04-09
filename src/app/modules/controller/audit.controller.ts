import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { AuditService } from "../services/audit.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
const createAudit = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const audit = await AuditService.createAudit(req.body );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Audit log created successfully.",
      data: audit,
    });
  },
);
export const AuditController = { createAudit };
