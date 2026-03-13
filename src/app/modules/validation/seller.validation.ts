import z from "zod";

export const createSellerValidation = z.object({
  motivation: z.string().min(10, "Motivation must be at least 10 characters").optional(),
  // cvLink: z.string().url("CV must be a valid URL"),
});
export const updateSellerValidation = z.object({
  status: z.enum(["approved", "rejected"]),
});
