import { Router } from "express";
import { WishListController } from "../modules/controller/wishlist.controller";
import { validateRequest } from "../middlewares/validateRequest";
import { createWishlistValidation } from "../modules/validation/wishlist.validation";
import { checkAuth } from "../middlewares/checkAuth";
import { ROLE } from "../modules/interface/user.interface";

const router = Router();
router.post(
  "/add",
  checkAuth(ROLE.USER),
  validateRequest(createWishlistValidation),
  WishListController.addWishList,
);
router.get(
  "/user-wishlist",
  checkAuth(ROLE.USER),
  WishListController.userWishlist,
);
router.delete(
  "/remove",
  checkAuth(ROLE.USER),
  WishListController.removeFromWishlist,
);
export const wishlistRoutes = router;
