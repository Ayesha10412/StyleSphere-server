import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import { ROLE } from "../modules/interface/user.interface";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createCartValidation,
  updateCartValidation,
} from "../modules/validation/cart.validation";
import { CartController } from "../modules/controller/cart.controller";

const router = Router();
router.get(
  "/my-cart",
  checkAuth(ROLE.USER,ROLE.ADMIN, ROLE.SUPER_ADMIN, ROLE.SELLER),
  CartController.getMyCart,
);
router.post(
  "/add-to-cart",
  checkAuth(ROLE.USER),
  validateRequest(createCartValidation),
  CartController.createCart,
);
router.patch(
  "/update-cart-item",
  checkAuth(ROLE.USER),
  validateRequest(updateCartValidation),
  CartController.updateCartItem,
);
router.delete(
  "/remove-cart-item",
  checkAuth(ROLE.USER),
  CartController.removeCartItem,
);
router.delete(
  "/clear-cart",
  checkAuth(ROLE.USER),
  CartController.clearCart,
);
export const cartRoutes = router;
