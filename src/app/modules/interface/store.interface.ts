import { Types } from "mongoose";

export interface IStore {
  _id?: Types.ObjectId;
  owner: Types.ObjectId;
  storeName: string;
  storeBanner?: string;
  storeDescription?: string;
  ratingAverage?: number;
  totalSales?: number;
  totalRevenue?: number;
  isApproved?: boolean;
}
