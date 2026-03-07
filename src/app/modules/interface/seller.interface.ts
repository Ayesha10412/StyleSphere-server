import { Types } from "mongoose";

export interface ISellerApplication {
  user: Types.ObjectId;
  motivation: string;
  cvLink?: string;
  status: "pending" | "approved" | "rejected";
  reviewedBy?: Types.ObjectId;
}
