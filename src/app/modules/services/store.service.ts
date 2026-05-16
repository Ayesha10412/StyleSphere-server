import AppError from "../../errorHelpers/appError";
import { IQuery } from "../../interfaces/error.types";
import { QueryBuilder } from "../../utils/queryBuilder";
import { IStore } from "../interface/store.interface";
import { ROLE } from "../interface/user.interface";
import { Seller } from "../model/seller.model";
import { Store } from "../model/store.model";
import { User } from "../model/user.models";
import httpStatus from "http-status-codes";
const createStore = async (userId: string, payload: IStore) => {
  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }
  if (isUserExist.role !== ROLE.SELLER) {
    throw new AppError(httpStatus.BAD_REQUEST, "Only seller can create store!");
  }
  const existingUser = await Store.findOne({ owner: userId });
  if (existingUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "Already you've a store");
  }
  const store = await Store.create({ ...payload, owner: userId });
  return store;
};
///get all store
const getAllStore = async (query: IQuery) => {
  const builder = new QueryBuilder(Store.find().lean(), query)
    .filter()
    .fields()
    .search(["storeName"])
    .paginate()
    .sort();
  const store = await builder.build();
  const meta = await builder.getMeta();
  return {
    data: store,
    meta,
  };
};
//get my store
const getMyStore = async (userId: string) => {
  const seller = await Seller.findOne({user:userId} );
  console.log("From service:", seller);
  if (!seller) {
    throw new AppError(httpStatus.NOT_FOUND, "Seller not found!");
  }
  const store = await Store.findOne({ owner: userId });
  if (!store) {
    throw new AppError(httpStatus.NOT_FOUND, "Store not found.");
  }
  return {
    data: store,
  };
};
///update store info
const updateStore = async (
  storeId: string,
  userId: string,
  payload: Partial<IStore>,
) => {
  const user = await User.findById(userId);
  if (!user || (user?.role !== ROLE.SELLER && user?.role !== ROLE.ADMIN && user?.role !==ROLE.SUPER_ADMIN)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You're not permitted to update the store information.",
    );
  }
  let store;
  if (user.role === ROLE.ADMIN) {
    store = await Store.findByIdAndUpdate(storeId, payload, {
      new: true,
      runValidators: true,
    });
  } else {
    store = await Store.findOneAndUpdate(
      { _id: storeId, owner: userId },
      payload,
      {
        new: true,
        runValidators: true,
      },
    );
  }

  if (!store) {
    throw new AppError(httpStatus.NOT_FOUND, "Store not found!");
  }
  return store;
};
export const StoreServices = {
  createStore,
  getAllStore,
  getMyStore,
  updateStore,
};
