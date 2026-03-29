import { model, Schema, Types } from "mongoose";
import { ICart, ICartItem } from "../interface/cart.interface";

const cartItemSchema = new Schema<ICartItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    variant: {
      size: { type: String, required: true },
      color: { type: String, required: true },
    },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);
const cartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [cartItemSchema],
    totalPrice: { type: Number, required: true, default: 0 },
  },
  { timestamps: true, versionKey: false },
);
export const Cart = model<ICart>("Cart", cartSchema);
