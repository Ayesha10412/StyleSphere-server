import z from "zod";

const variantValidation = z.object({
  size: z.string().optional(),
  color: z.string().optional(),
});

const cartIemValidation = z.object({
  product: z.string(),
  variant: variantValidation.optional(),
  price: z.number().min(0, "Price must be a non-negative number.").optional(),
  quantity: z.number().min(1, "Quantity must be at least 1."),
});
export const createCartValidation = z.object({
  items: z.array(cartIemValidation).min(1, "Cart can not be empty."),
  totalPrice: z.number().min(0).optional(),
});
// export const updateCartValidation = z.object({
//   items: z.array(cartIemValidation).min(1, "Cart can not be empty.").optional(),
//   totalPrice: z.number().min(0).optional(),
// });
export const updateCartValidation = z.object({
  productId: z.string(),
  quantity: z.number(),
  variant: z
    .object({
      size: z.string().optional(),
      color: z.string().optional(),
    })
    .optional(),
});