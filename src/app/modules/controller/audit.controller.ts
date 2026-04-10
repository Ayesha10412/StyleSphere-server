import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuditService } from "../services/audit.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { IQuery } from "../../interfaces/error.types";
// audit.controller.ts
const allAudit = catchAsync(async (req, res) => {
  const result = await AuditService.allAudit(req.query as IQuery);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Audit logs retrieved",
    data: result.data,
    meta: result.meta,
  });
});
export const AuditController = { allAudit };
