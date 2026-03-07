import { Types } from "mongoose";

export interface IAuditLog {
  actionType: string;
  performedBy: Types.ObjectId;
  targetId?: Types.ObjectId;
  targetCollection?: string;
  metadata?: Record<string, any>;
}
