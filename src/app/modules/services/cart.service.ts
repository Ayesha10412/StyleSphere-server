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
const getMyCart = async (userId: string) => {
  const cart = await Cart.findOne({
    user: userId,
  })
    .populate({
      path: "items.product",
      select: "title price discountPrice images category variants",
    })
    .lean();

  if (!cart) {
    return {
      items: [],
      totalPrice: 0,
    };
  }

  return cart;
};
// const updateCartItem = async (
//   userId: string,
//   productId: string,
//   quantity: number,
//   variant?: { size?: string; color?: string },
// ) => {
//   const cart = await Cart.findOne({ user: userId });
//   if (!cart) {
//     throw new AppError(httpStatus.NOT_FOUND, "Cart not found!");
//   }
//   const item = cart.items.find((i) => {
//     const sameProduct = i.product.toString() === productId;

//     const sameVariant =
//       (!variant && !i.variant) ||
//       (variant &&
//         i.variant &&
//         i.variant.size === variant.size &&
//         i.variant.color === variant.color);

//     return sameProduct && sameVariant;
//   });
//   if (!item) {
//     throw new AppError(httpStatus.NOT_FOUND, "Item not found.");
//   }
//   if (quantity <= 0) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Invalid quantity.");
//   }
//   const product = await Product.findById(productId);
//   if (!product || product.variants[0].stock < quantity.toString()) {
//     throw new AppError(httpStatus.NOT_FOUND, "Product not found.");
//   }
//   item.quantity = quantity;
//   //recalculate price
//   let totalPrice = 0;
//   for (const i of cart.items) {
//     const p = await Product.findById(i.product);
//     totalPrice += p!.price * i.quantity;
//   }
//   cart.totalPrice = totalPrice;
//   await cart.save();
//   return cart;
// };
//remove all items from cart
const updateCartItem = async (
  userId: string,
  productId: string,
  quantity: number,
  variant?: { size?: string; color?: string },
) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new AppError(httpStatus.NOT_FOUND, "Cart not found!");
  }
  console.log(cart);
  const item = cart.items.find((i) => {
    const sameProduct = i.product.toString() === productId;

    const sameVariant =
      (!variant?.size || i.variant?.size === variant.size) &&
      (!variant?.color || i.variant?.color === variant.color);

    return sameProduct && sameVariant;
  });

  if (!item) {
    throw new AppError(httpStatus.NOT_FOUND, "Item not found.");
  }

  if (quantity <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid quantity.");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found.");
  }

  const matchedVariant = product.variants.find((v) => {
    return (
      (!variant?.size || v.size === variant.size) &&
      (!variant?.color || v.color === variant.color)
    );
  });
  console.log(matchedVariant);
  if (!matchedVariant) {
    throw new AppError(httpStatus.NOT_FOUND, "Variant not found.");
  }

  if (Number(matchedVariant.stock) < quantity) {
    throw new AppError(httpStatus.BAD_REQUEST, "Insufficient stock.");
  }

  item.quantity = quantity;

  let totalPrice = 0;

  for (const i of cart.items) {
    const p = await Product.findById(i.product);
    totalPrice += p!.price * i.quantity;
  }

  cart.totalPrice = totalPrice;

  await cart.save();
  return cart;
};

const removeCartItem = async (
  userId: string,
  productId: string,
  variant?: { size?: string; color?: string },
) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new AppError(httpStatus.NOT_FOUND, "Cart not found!");
  }
  cart.items = cart.items.filter(
    (i) =>
      !(
        i?.product?.toString() === productId &&
        i?.variant?.size === variant?.size &&
        i?.variant?.color === variant?.color
      ),
  );
  //recalculate price
  let totalPrice = 0;
  for (const i of cart.items) {
    const p = await Product.findById(i.product);
    totalPrice += p!.price * i.quantity;
  }
  cart.totalPrice = totalPrice;
  await cart.save();
  return cart;
};
//clear cart
const clearCart = async (userId: string) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new AppError(httpStatus.NOT_FOUND, "Cart not found");
  }
  cart.items = [];
  cart.totalPrice = 0;

  await cart.save();

  return cart;
};
export const CartServices = {
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  getMyCart,
};
