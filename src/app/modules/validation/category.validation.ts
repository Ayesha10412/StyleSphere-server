import z from "zod";

export const createCategoryValidation = z.object({
  name: z.string("Name is required."),
});
export const updateCategoryValidation = z.object({
  name: z.string().optional(),
  isDeleted: z.boolean().optional(),
});
