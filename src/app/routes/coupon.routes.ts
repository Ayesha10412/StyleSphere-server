import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import { ROLE } from "../modules/interface/user.interface";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createCouponValidation,
  updateCouponValidation,
} from "../modules/validation/coupon.validation";
import { CouponController } from "../modules/controller/coupon.controller";

const router = Router();
router.get("/", checkAuth(ROLE.SELLER), CouponController.allCoupon);
router.get("/:id", checkAuth(ROLE.SELLER), CouponController.couponDetails);
router.post(
  "/",
  checkAuth(ROLE.SELLER),
  validateRequest(createCouponValidation),
  CouponController.createCoupon,
);
router.patch(
  "/",
  checkAuth(ROLE.SELLER),
  validateRequest(updateCouponValidation),
  CouponController.updateCoupon,
);
router.delete("/:id", checkAuth(ROLE.SELLER), CouponController.deleteCoupon);
export const couponRoutes=Router()