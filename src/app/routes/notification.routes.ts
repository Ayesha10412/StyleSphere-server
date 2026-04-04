import { Router } from "express";
import { NotificationController } from "../modules/controller/notification.controller";
import { validateRequest } from "../middlewares/validateRequest";
import { createNotificationValidation } from "../modules/validation/notification.validation";

const router = Router();
router.get("/", NotificationController.getNotification);
router.post(
  "/",
  validateRequest(createNotificationValidation),
  NotificationController.createNotification,
);
export const notificationRoutes = router;