import { model, Schema, Types } from "mongoose";
import { IProduct, IProductVariant } from "../interface/product.interface";
const productVariantSchema=new Schema <IProductVariant> ({
size:{
type:String,required:true
},
color:{
type:String,required:true
},
stock:{
type:String,required:true
},
sku:{
type:String
}
},{ _id: false })
const productSchema=new Schema <IProduct> ({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  seller: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
  store: { type: Schema.Types.ObjectId, ref: "Store", required: true },
  images: [{ type: String }],
  variants: [productVariantSchema],
  ratingsAverage: { type: Number, min: 0, max: 5 },
  ratingsCount: { type: Number, default: 0 },
  isApproved: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date }
}
,{timestamps:true,versionKey:false});
export const Product=model<IProduct>("Product",productSchema)