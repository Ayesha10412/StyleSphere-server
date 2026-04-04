import z from "zod";

export const createNotificationValidation = z.object({
  type: z.enum(["order", "status_update", "seller_approval", "announcement"]),
  message: z.string().min(1, "Message is required"),
  isRead: z.boolean().optional(),
});

