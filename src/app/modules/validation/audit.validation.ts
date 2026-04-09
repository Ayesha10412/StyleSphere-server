import z from "zod";

export const createAuditValidation = z.object({
  actionType: z.string("Action type is required"),
  performedBy: z.string("Performed by id is required."),
  targetId: z.string().optional(),
  targetCollection: z.string().optional(),
  metaData: z.record(z.string(), z.any()).optional(),
});
