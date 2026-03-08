import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/appError";
import { IAuthProviders, IUser, ROLE } from "../interface/user.interface";
import { User } from "../model/user.models";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";
import { QueryBuilder } from "../../utils/queryBuilder";
import { IQuery } from "../../interfaces/error.types";
//create user
const createUser = async (payload: IUser) => {
  const { email, password, auths, ...rest } = payload;
  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User with this email already exists",
    );
  }
  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND),
  );
  const authProvider: IAuthProviders = {
    provider: "credentials",
    providerId: email,
  };
  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });
  return user;
};
///get all users
const getAllUser = async (query: IQuery) => {
  const builder = new QueryBuilder(User.find(), query)
    .filter()
    .search(["name", "email"])
    .sort()
    .fields()
    .paginate();
  const users = await builder.build();
  const meta = await builder.getMeta();
  return {
    data: users,
    meta,
  };
};
//update user
const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload,
) => {
  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }
  if (payload.role) {
    if (
      decodedToken.role === ROLE.CUSTOMER ||
      decodedToken.role === ROLE.SELLER
    ) {
      throw new AppError(httpStatus.FORBIDDEN, "You're not authorized!");
    }
  }
  if (payload.role === ROLE.SUPER_ADMIN && decodedToken.role === ROLE.ADMIN) {
    throw new AppError(httpStatus.FORBIDDEN, "You're not authorized!");
  }
  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (
      decodedToken.role === ROLE.CUSTOMER ||
      decodedToken.role === ROLE.SELLER
    ) {
      throw new AppError(httpStatus.FORBIDDEN, "You're not authorized!");
    }
  }
  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      envVars.BCRYPT_SALT_ROUND,
    );
  }
  const newUpdateUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });
  return newUpdateUser;
};
///delete user
const deleteUser = async (userId: string, decodedToken: JwtPayload) => {
  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }
  if (
    decodedToken.role === ROLE.CUSTOMER ||
    decodedToken.role === ROLE.SELLER
  ) {
    throw new AppError(httpStatus.FORBIDDEN, "You're not authorized!");
  }
  if (
    isUserExist.role === ROLE.SUPER_ADMIN &&
    decodedToken.role === ROLE.ADMIN
  ) {
    throw new AppError(httpStatus.FORBIDDEN, "You're not authorized!");
  }
  const user = await User.findByIdAndUpdate(
    userId,
    { isDeleted: true },
    { new: true },
  );
  return user;
};
//getMe
const getMe = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }
  return {
    data: user,
  };
};
///get single user
const getSingleUser = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }
  return {
    data: user,
  };
};
export const UserService = {
  createUser,
  getAllUser,
  updateUser,
  deleteUser,
  getMe,
  getSingleUser,
};
