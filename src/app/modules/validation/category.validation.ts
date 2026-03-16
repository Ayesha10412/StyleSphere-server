import z from "zod";

export const createCategoryValidation = z.object({
  name: z.string("Name is required."),
  slug: z.string("Slug is required."),
});
export const updateCategoryValidation = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
  isDeleted: z.boolean().optional(),
});
