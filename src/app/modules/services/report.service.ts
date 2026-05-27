import { IQuery } from "../../interfaces/error.types";
import { QueryBuilder } from "../../utils/queryBuilder";
import { Order } from "../model/order.model";

const report = async (query: IQuery) => {
  // 1. Build custom filter manually
  const filter: any = {};

  // date range filter (IMPORTANT PART)
  if (query.startDate || query.endDate) {
    filter.createdAt = {};

    if (query.startDate) {
      filter.createdAt.$gte = new Date(query.startDate as string);
    }

    if (query.endDate) {
      filter.createdAt.$lte = new Date(query.endDate as string);
    }
  }

  // 2. Create QueryBuilder with pre-filtered query
  const builder = new QueryBuilder(Order.find(filter).lean(), query)
    .filter()
    .search(["paymentStatus"])
    .sort()
    .fields()
    .paginate();

  const data = await builder.build();
  const meta = await builder.getMeta();

  return {
    data,
    meta,
  };
};

export const ReportService = {
  report,
};
