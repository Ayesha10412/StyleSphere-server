import AppError from "../../errorHelpers/appError";
import { IProduct } from "../interface/product.interface";
import { Category } from "../model/categories.model";
import httpStatus from "http-status-codes";
import { Store } from "../model/store.model";
import { Product } from "../model/product.model";
import { User } from "../model/user.models";
import { IQuery } from "../../interfaces/error.types";
import { QueryBuilder } from "../../utils/queryBuilder";
import { ROLE } from "../interface/user.interface";
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
  // if (store.owner.toString() !== sellerId) {
  //   throw new AppError(httpStatus.BAD_REQUEST, "Not your store!");
  // }
  const categories = await Category.find({ user: userId });
  //   console.log("categories:", categories);
  //   console.log(
  //     "categories IDs:",
  //     categories.map((c) => c._id.toString()),
  //   );
  const category = categories.find(
    (c) => c._id.toString() === (payload.category as unknown as string),
  );
  //   console.log("Category:", category);

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found.");
  }
  const product = await Product.create({
    ...payload,
    seller: seller._id,
    store: store._id,
    category: category._id,
  });
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found.");
  }
  return product;
};
//get all product
const getAllProduct = async (query: IQuery) => {
  const builder = new QueryBuilder(Product.find().lean().populate("category","name"), query)
    .fields()
    .sort()
    .paginate()
    // .search(["title price variants.size variants.color"])
    .search(["title", "price","variants.size", "variants.color"])
    .filter();
  const product = await builder.build();
  const meta = await builder.getMeta();
  return { data: product, meta };
};
///get product by id
const productDetails = async (productId: string) => {
  const product = await Product.findById(productId).populate("category","name");
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found.");
  }
  return product;
};
//update product
const updateProduct = async (
  productId: string,
  userId: string,
  payload: IProduct,
) => {
  const user = await User.findById(userId);
  //console.log("User from service:", user);
  if (
    (!user || (user!.role !== ROLE.ADMIN && user!.role !== ROLE.SUPER_ADMIN)) &&
    user!.role !== ROLE.SELLER
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You're not permitted to view this route.",
    );
  }
  const { images, ...rest } = payload;
  let updateData: any = { ...rest };
  if (images && images.length > 0) {
    updateData.$push = {
      images: { $each: images },
    };
  }
  const product = await Product.findByIdAndUpdate(productId, updateData, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found.");
  }
  return product;
};
//delete product
const deleteProduct = async (productId: string, userId: string) => {
  const product = await Product.findByIdAndDelete(productId, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found.");
  }
  return product;
};
export const ProductService = {
  createProduct,
  getAllProduct,
  productDetails,
  updateProduct,
  deleteProduct,
};
