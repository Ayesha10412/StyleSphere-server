import { model, Schema, Types } from "mongoose";
import { IAuditLog } from "../interface/audit.interface";

const auditLogSchema = new Schema<IAuditLog>({
  actionType: {
    type: String,
    required: true,
  },
  performedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  targetId: {
    type: Schema.Types.ObjectId,
    refPath: "targetCollection",
  },
  targetCollection: {
    type: String,
    enum: ["User", "Product", "Order"],
  },
  metadata: {
    type: Map,
    of: Schema.Types.Mixed,
  },
}, { timestamps: true, versionKey: false });
export const AuditLog = model<IAuditLog>("AuditLog", auditLogSchema);