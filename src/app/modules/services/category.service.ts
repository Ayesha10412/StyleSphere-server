import AppError from "../../errorHelpers/appError";
import { IQuery } from "../../interfaces/error.types";
import { QueryBuilder } from "../../utils/queryBuilder";
import { ICategory } from "../interface/categories.interface";
import { ROLE } from "../interface/user.interface";
import { Category } from "../model/categories.model";
import { User } from "../model/user.models";
import httpStatus from "http-status-codes";
const createCategory = async (userId: string, payload: ICategory) => {
  const users = await User.findById(userId);
  if (
    (!users && users!.role !== ROLE.ADMIN) ||
    (users!.role !== ROLE.SUPER_ADMIN && users!.role !== ROLE.SELLER)
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You're not permitted to view this route.",
    );
  }
  const category = await Category.create({ users: userId, ...payload });
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
  const category = await Category.findById(categoryId);
  console.log(category);
  return category;
};
export const CategoryService = { createCategory, getAllCategory };
