import z from "zod";

export const createStoreValidation = z.object({
  storeName: z.string().min(3, "Store name must be at least 3 characters!"),
  storeDescription: z.string().optional(),
  storeBanner: z.string("Store banner is required"),
  ratingAverage: z.number().optional(),
  totalSales: z.number().optional(),
  totalRevenue: z.number().optional(),
});
export const updateStoreValidation = z.object({
  isApproved: z.boolean().optional(),
  storeBanner: z.string().optional(),
  storeName: z.string().optional(),
  ratingAverage: z.number().optional(),
  totalSales: z.number().optional(),
  totalRevenue: z.number().optional(),
  storeDescription: z.string().optional(),
});
