import { Router } from "express";
import { PaymentController } from "../modules/controller/payment.controller";

const router=Router();
router.post("/init/:orderId",PaymentController.initPayment);
router.all("/success",PaymentController.successPayment);
router.all("/failed",PaymentController.failedPayment);
router.all("/cancelled",PaymentController.cancelledPayment);
export const PaymentRoutes=router;
