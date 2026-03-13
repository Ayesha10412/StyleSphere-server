import z from "zod";

export const createStoreValidation = z.object({
  storeName: z.string().min(3, "Store name must be at least 3 characters!"),
  storeBanner: z.string().optional(),
  storeDescription: z.string().optional(),
  ratingAverage: z.number().optional(),
  totalSales: z.number().optional(),
  totalRevenue: z.number().optional(),
});
export const updateStoreValidation = z.object({
  isApproved: z.boolean().optional(),
});
