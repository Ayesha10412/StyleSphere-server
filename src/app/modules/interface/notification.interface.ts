import { Types } from "mongoose";

export interface INotification {
  user: Types.ObjectId;
  type: "order" | "status_update" | "seller_approval" | "announcement";
  message: string;
  isRead?: boolean;
}
