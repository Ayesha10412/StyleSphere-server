import { model, Schema } from "mongoose";
import { ICategory } from "../interface/categories.interface";

const categorySchema=new Schema <ICategory> ({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  isDeleted: { type: Boolean, default: false }
},{timestamps:true,versionKey:false})
export const Category=model<ICategory>("Category",categorySchema)