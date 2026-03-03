import { Types } from "mongoose";

export interface IReview {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  product: Types.ObjectId;
  rating: number;
  comment: string;
  images?: string[];
  sellerReply?: string;
  isVerifiedPurchase?: boolean;
  isApproved?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
