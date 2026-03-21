import AppError from "../../errorHelpers/appError";
import { IProduct } from "../interface/product.interface";
import { Category } from "../model/categories.model";
import httpStatus from "http-status-codes";
import { Store } from "../model/store.model";
import { Product } from "../model/product.model";
import { User } from "../model/user.models";
const createProduct = async (userId: string, payload: IProduct) => {
  const seller = await User.findById(userId);
  console.log("Seller:", seller);
  if (!seller) {
    throw new AppError(httpStatus.NOT_FOUND, "Seller not found!");
  }
  const store = await Store.findOne({ owner: userId });
  console.log(store);
  if (!store) {
    throw new AppError(httpStatus.NOT_FOUND, "Store not found.");
  }
  //   if (store.owner.toString() !== sellerId) {
  //     throw new AppError(httpStatus.BAD_REQUEST, "Not your store!");
  //   }
  const categories = await Category.find({ user: userId });
  console.log("categories:", categories);
  console.log(
    "categories IDs:",
    categories.map((c) => c._id.toString()),
  );
  const category = categories.find(
    (c) => c._id.toString() === payload.category,
  );
  console.log("Category:", category);

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found.");
  }
  const product = await Product.create({
    seller: seller._id,
    store: store._id,
    category: category._id,
    ...payload,
  });
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found.");
  }
  return product;
};
export const ProductService = { createProduct };
