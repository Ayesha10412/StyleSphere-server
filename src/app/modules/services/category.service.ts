import AppError from "../../errorHelpers/appError";
import { IQuery } from "../../interfaces/error.types";
import { QueryBuilder } from "../../utils/queryBuilder";
import { ICategory } from "../interface/categories.interface";
import { ROLE } from "../interface/user.interface";
import { Category } from "../model/categories.model";
import { User } from "../model/user.models";
import httpStatus from "http-status-codes";
import slugify from "slugify";
const createCategory = async (userId: string, payload: ICategory) => {
  const user = await User.findById(userId);
  if (
    (!user && user!.role !== ROLE.ADMIN) ||
    (user!.role !== ROLE.SUPER_ADMIN && user!.role !== ROLE.SELLER)
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You're not permitted to view this route.",
    );
  }
  const slug = slugify(payload.name, { lower: true });
  const category = await Category.create({
    ...{ user: user },
    ...payload,
    slug: slug,
  });
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category is not found.");
  }
  return category;
};
//get all category
const getAllCategory = async (query: IQuery) => {
  const builder = new QueryBuilder(Category.find().lean(), query)
    .fields()
    .search(["name"])
    .paginate()
    .sort()
    .filter();
  const category = await builder.build();
  const meta = await builder.getMeta();
  return { data: category, meta };
};
//get category by id
const categoryDetails = async (categoryId: string) => {
  const category = await Category.findOne({ _id: categoryId });
  console.log(category);
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found!");
  }
  return category;
};
//update category
const updateCategory = async (
  categoryId: string,
  userId: string,
  payload: ICategory,
) => {
  const category = await Category.findOne({ _id: categoryId });
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found!");
  }
  const user = await User.findById(userId);
  if (
    !user || ![ROLE.SUPER_ADMIN ,ROLE.ADMIN,ROLE.SELLER].includes(user?.role)
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You're not permitted to view route.",
    );
  }
  let updateData: ICategory = { ...payload };
  if (payload.name) {
    updateData.slug = slugify(payload.name, { lower: true });
  }
  const result = await Category.findByIdAndUpdate(category, updateData, {
    new: true,
    runValidators: true,
  });
  if (!result) {
    throw new AppError(httpStatus.NOT_MODIFIED, "Category update failed!");
  }
  return result;
};
//delete category
const deleteCategory = async (categoryId: string, userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found.");
  }
  if (
    ![ROLE.SUPER_ADMIN,ROLE.ADMIN,ROLE.SELLER].includes(user?.role)
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You're not allowed to delete this category.",
    );
  }
  const category = await Category.findOneAndDelete({
    _id: categoryId,
    user: userId,
  });
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category is not deleted.");
  }
  return category;
};
export const CategoryService = {
  createCategory,
  getAllCategory,
  categoryDetails,
  updateCategory,
  deleteCategory,
};
