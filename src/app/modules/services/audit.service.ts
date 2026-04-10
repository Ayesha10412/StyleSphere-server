import AppError from "../../errorHelpers/appError";
import { IQuery } from "../../interfaces/error.types";
import { QueryBuilder } from "../../utils/queryBuilder";
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
//get all audit
const allAudit = async (query: IQuery) => {
  const builder = new QueryBuilder(AuditLog.find().lean(), query)
    .sort()
    .paginate()
    .search(["actionType"]);
  const meta = await builder.getMeta();
  const data = await builder.build();
  return { meta, data };
};
export const AuditService = { createAudit,allAudit };
