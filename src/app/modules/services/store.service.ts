import AppError from "../../errorHelpers/appError";
import { IStore } from "../interface/store.interface";
import { ROLE } from "../interface/user.interface";
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
  const existingUser = await Store.findById({ owner: userId });
  if (existingUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "Already you've a store");
  }
  const store = await Store.create({ ...payload, owner: userId });
  return store;
};
export const StoreServices = {
  createStore,
};
