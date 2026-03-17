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
export const CategoryService = {
  createCategory,
  getAllCategory,
  categoryDetails,
};
