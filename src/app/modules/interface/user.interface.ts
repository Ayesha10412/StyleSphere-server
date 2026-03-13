import { Types } from "mongoose";

export enum ROLE {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  USER = "user",
  SELLER = "seller",
}
export interface IAuthProviders {
  provider: "google" | "credentials";
  providerId: string;
}

export enum IsActive {
  ACTIVE = "active",
  INACTIVE = "inactive",
  BLOCKED = "blocked",
}
export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  role: ROLE;
  auths: IAuthProviders[];
  phone?: string;
  address?: string;
  isDeleted?: boolean;
  isActive?: IsActive;
  isVerified?: boolean;
  picture?: string;
  failedLoginAttempts?: number;
  lockUntil?: Date;
}
