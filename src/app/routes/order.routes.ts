import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import { ROLE } from "../modules/interface/user.interface";
import { validateRequest } from "../middlewares/validateRequest";
import { createOrderValidation } from "../modules/validation/order.validation";
import { orderController } from "../modules/controller/order.controller";

const router = Router();
router.get("/", checkAuth(ROLE.SELLER), orderController.allOrder);
router.get("/:id", checkAuth(ROLE.SELLER), orderController.orderDetails);
router.post(
  "/",
  checkAuth(ROLE.USER),
  validateRequest(createOrderValidation),
  orderController.createOrder,
);
export const orderRoutes = router;
