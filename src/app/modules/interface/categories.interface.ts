import { Types } from "mongoose";

export interface ICategory {
  _id?: Types.ObjectId;
  user:Types.ObjectId;
  name: string;
  slug: string;
  isDeleted?: boolean;
}
