import z from "zod";

export const createSellerValidation = z
  .object({
    name: z
      .string("Name is required")
      .min(10 ,"Motivation must be at least 10 characters"),
    cvLink: z.string().url("CV must be a valid URL").optional()
    
  })
  export const updateSellerValidation=z.object({
    status:z.enum(["approved","rejected"],"Status is required!")
  })