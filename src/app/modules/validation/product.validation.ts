import z from "zod";
const productVariantValidation = z.object({
  size: z.string(),
  color: z.string(),
  stock: z.string(),
  sku: z.string().optional(),
});
export const createProductValidation = z.object({
  title: z.string("Title is required").min(1, "Must be at least 1 characters."),
  description: z.string("Product description is required!"),
  price: z.coerce.number("Price is required."),
  discountPrice: z.coerce.number().optional(),
  //images: z.string("Image is required"),
  category: z.string("Category is required"),
  variants: z.array(productVariantValidation),
  ratingsAverage: z.coerce.number().optional(),
  ratingsCount: z.coerce.number().optional(),
});
export const updateProductValidation = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number().optional(),
  discountPrice: z.number().optional(),
  images: z.array(z.string()).optional(),
  variants: z.array(productVariantValidation).optional(),
  ratingsAverage: z.number().optional(),
  ratingsCount: z.number().optional(),
  isApproved: z.number().optional(),
  isDeleted: z.number().optional(),
  deletedAt: z.number().optional(),
});
