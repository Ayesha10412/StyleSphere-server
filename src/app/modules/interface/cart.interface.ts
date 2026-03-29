import { Types } from "mongoose";

export interface ICartItem {
  product: Types.ObjectId;
  variant: {
    size: string;
    color: string;
  };
  price: number;
  quantity: number;
}
export interface ICart {
  user: Types.ObjectId;
  items: ICartItem[];
  totalPrice: number;
}
