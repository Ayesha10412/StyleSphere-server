import AppError from "../../errorHelpers/appError";
import { ICart } from "../interface/cart.interface";
import { ROLE } from "../interface/user.interface";
import { Cart } from "../model/cart.model";
import { Product } from "../model/product.model";
import { User } from "../model/user.models";
import httpStatus from "http-status-codes";

const addToCart = async (userId: string, payload: ICart) => {
  //  1. Validate user
  const user = await User.findById(userId);
  if (!user || user.role !== ROLE.USER) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only users can add items to cart!",
    );
  }

  // 2. Get existing cart
  let cart = await Cart.findOne({ user: userId });

  const existingProductIds = cart?.items.map((i) => i.product) || [];

  const allIds = [
    ...payload.items.map((i) => i.product),
    ...existingProductIds,
  ];

  const uniqueIds = [...new Set(allIds.map((id) => id.toString()))];

  const products = await Product.find({ _id: { $in: uniqueIds } });

  if (products.length !== uniqueIds.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Some products not found.");
  }

  //  5. Create product map (fast lookup)
  const productMap = new Map<string, any>();
  products.forEach((p) => productMap.set(p._id.toString(), p));

  if (!cart) {
    let totalPrice = 0;

    for (const item of payload.items) {
      if (item.quantity <= 0) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid quantity");
      }

      const product = productMap.get(item.product.toString());

      if (product.stock < item.quantity) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `Not enough stock for ${product.name}`,
        );
      }

      totalPrice += product.price * item.quantity;
    }

    const newCart = await Cart.create({
      user: userId,
      items: payload.items,
      totalPrice,
    });

    return newCart;
  }

  for (const newItem of payload.items) {
    if (newItem.quantity <= 0) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid quantity");
    }

    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === newItem.product.toString() &&
        item.variant?.size === newItem.variant?.size &&
        item.variant?.color === newItem.variant?.color,
    );

    if (existingItem) {
      existingItem.quantity += newItem.quantity;
    } else {
      cart.items.push(newItem);
    }
  }

  //  6. Recalculate total price (SECURITY)
  let totalPrice = 0;

  for (const item of cart.items) {
    const product = productMap.get(item.product.toString());

    if (!product) {
      throw new AppError(httpStatus.NOT_FOUND, "Product not found.");
    }

    if (product.stock < item.quantity) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Not enough stock for ${product.name}`,
      );
    }

    totalPrice += product.price * item.quantity;
  }

  cart.totalPrice = totalPrice;

  //  7. Save updated cart
  await cart.save();

  return cart;
};

export const CartServices = { addToCart };
