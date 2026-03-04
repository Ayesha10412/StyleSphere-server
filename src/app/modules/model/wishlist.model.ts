import { model, Schema, Types } from "mongoose";
import { IWishlist } from "../interface/wishlist.interface";

const wishlistSchema=new Schema <IWishlist>( {
  user:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },
  product:{
    type:Schema.Types.ObjectId,
    ref:"Product",
    required:true,
  }
},{timestamps:true,versionKey:false}
)
export const Wishlist=model<IWishlist>("Wishlist",wishlistSchema)