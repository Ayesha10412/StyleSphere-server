import { Query } from "mongoose";
import { excludeField } from "../constants";
import { IQuery } from "../interfaces/error.types";

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
//   public readonly query: Record<string, string>;
  public readonly query: IQuery;
  constructor(modelQuery: Query<T[], T>, query: IQuery) {
    this.modelQuery = modelQuery;
    this.query = query;
  }
  filter(): this {
    const filter = { ...this.query };
    for (const field of excludeField) {
      delete filter[field];
    }
    this.modelQuery = this.modelQuery.find(filter);
    return this;
  }
  search(searchableField: string[]): this {
    const searchTerm = this.query.searchTerm || "";
    if (searchTerm.trim() !== "") {
      const searchQuery = {
        $or: searchableField.map((field) => ({
          [field]: { $regex: searchTerm, $options: "i" },
        })),
      };
      this.modelQuery = this.modelQuery.find({ $and: [searchQuery] }); // keeps previous filters
    }
    return this;
  }
  sort(): this {
    const sort = this.query.sort || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }
  fields(): this {
    const fields = this.query.fields?.split(",").join(" ");
    if (fields) this.modelQuery = this.modelQuery.select(fields);
    else this.modelQuery = this.modelQuery.select("-__v -password");
    return this;
  }
  paginate(): this {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }
  build() {
    return this.modelQuery;
  }
  async getMeta() {
    const totalDocuments = await this.modelQuery.clone().countDocuments();
    // const page = Number(this.query.page) || 1;
    // const limit = Number(this.query.limit) || 10;
    const page = Math.max(Number(this.query.page) || 1, 1);
    const limit = Math.max(Number(this.query.limit) || 10, 1);
    const totalPage = Math.ceil(totalDocuments / limit);
    return { page, limit, total: totalDocuments, totalPage };
  }
}
