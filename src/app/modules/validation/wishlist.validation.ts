import z from "zod";

export const createWishlistValidation = z.object({
  //user: z.string("User ID is required"),
  product: z.string("Product ID is required"),
});
