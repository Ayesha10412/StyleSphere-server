import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import { ROLE } from "../modules/interface/user.interface";
import { validateRequest } from "../middlewares/validateRequest";
import { createCartValidation } from "../modules/validation/cart.validation";
import { CartController } from "../modules/controller/cart.controller";

const router = Router();
router.post(
  "/add-to",
  checkAuth(ROLE.USER),
  validateRequest(createCartValidation),
  CartController.createCart,
);
export const cartRoutes = router;
