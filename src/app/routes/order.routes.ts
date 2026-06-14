import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import { ROLE } from "../modules/interface/user.interface";
import { validateRequest } from "../middlewares/validateRequest";
import { createOrderValidation } from "../modules/validation/order.validation";
import { orderController } from "../modules/controller/order.controller";

const router = Router();
router.get("/", checkAuth(ROLE.SUPER_ADMIN,ROLE.ADMIN), orderController.allOrder);
router.get("/shop-order", checkAuth(ROLE.SELLER), orderController.myShopOrder);
router.get("/my-order", checkAuth(ROLE.USER), orderController.myOrder);
router.get("/:id", checkAuth(ROLE.SELLER), orderController.orderDetails);
router.post(
  "/",
  checkAuth(ROLE.USER),
  validateRequest(createOrderValidation),
  orderController.createOrder,
);
export const orderRoutes = router;
