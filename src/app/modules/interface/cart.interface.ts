import { Types } from "mongoose";

 interface ICartItem {
  product: Types.ObjectId;
  variant: {
    size: string;
    color: string;
  };
  quantity: number;
}
export interface ICart {
  user: Types.ObjectId;
  items: ICartItem[];
  totalPrice: number;
}
