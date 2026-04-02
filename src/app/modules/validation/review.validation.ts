import z from "zod";

export const createReviewValidation = z.object({
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot be more than 5"),
  comment: z.string().min(1, "Comment is required"),
  // images: z.array(z.string()).optional(),
  sellerReply: z.string().optional(),
  isVerifiedPurchase: z.boolean().optional(),
});
