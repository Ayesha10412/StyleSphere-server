import { Types } from "mongoose";
export interface IProductVariant {
size:string;
color:string;
stock:string;
sku?:string
}
export interface IProduct {
  _id?: Types.ObjectId;
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: Types.ObjectId;
  seller: Types.ObjectId;
  store: Types.ObjectId;
  images: string[];
  variants: IProductVariant[];
  ratingsAverage?:number;
  ratingsCount?:number;
  isApproved?:boolean;
  isDeleted?:boolean;
  deletedAt?:Date;
  
}
