import AppError from "../../errorHelpers/appError";
import { IAuditLog } from "../interface/audit.interface";
import { AuditLog } from "../model/audit.model";
import httpStatus from "http-status-codes";
const createAudit = async (payload: IAuditLog) => {
  const audit = await AuditLog.create(payload);
  if (!audit) {
    throw new AppError(httpStatus.BAD_REQUEST, "Audit does not created");
  }
  return audit;
};
export const AuditService = { createAudit };
