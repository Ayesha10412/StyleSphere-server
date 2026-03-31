import { Router } from "express";
import { PaymentController } from "../modules/controller/payment.controller";

const router=Router();
router.post("/init/:orderId",PaymentController.initPayment);
router.get("/success",PaymentController.successPayment);
router.get("/failed",PaymentController.failedPayment);
router.get("/cancelled",PaymentController.cancelledPayment);
export const PaymentRoutes=router;