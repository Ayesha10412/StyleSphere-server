// utils/normalizeId.ts
import mongoose from "mongoose";
export const normalizeId = (
  id?:
    | string
    | mongoose.Types.ObjectId
    | { _id: string | mongoose.Types.ObjectId },
): string => {
  if (!id) throw new Error("ID is required");

  if (typeof id === "object" && "_id" in id) {
    id = id._id;
  }

  if (id instanceof mongoose.Types.ObjectId) {
    return id.toString();
  }

  return id as string;
};
export const toObjectId = (
  id:
    | string
    | mongoose.Types.ObjectId
    | { _id: string | mongoose.Types.ObjectId },
): mongoose.Types.ObjectId => {
  if (!id) throw new Error("ID is required");

  // If it's an object with _id, extract it
  if (typeof id === "object" && "_id" in id) {
    id = id._id;
  }

  // If it's already an ObjectId, return it
  if (id instanceof mongoose.Types.ObjectId) {
    return id;
  }

  // If it's a string, validate and convert to ObjectId
  if (typeof id === "string") {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ObjectId format");
    }
    return new mongoose.Types.ObjectId(id);
  }

  // Fallback (should never happen)
  throw new Error("Cannot convert ID to ObjectId");
};
