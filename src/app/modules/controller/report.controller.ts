import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { IQuery } from "../../interfaces/error.types";
import { ReportService } from "../services/report.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
const report = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req?.query as IQuery;
    const data = await ReportService.report(query);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Report generated successfully.",
      data,
    });
  }         
);
export const ReportController = {
  report,
};