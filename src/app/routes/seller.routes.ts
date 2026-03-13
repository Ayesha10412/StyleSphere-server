import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import { ROLE } from "../modules/interface/user.interface";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createSellerValidation,
  updateSellerValidation,
} from "../modules/validation/seller.validation";
import { SellerController } from "../modules/controller/seller.controller";
import { multerUpload } from "../config/multer.config";

const router = Router();

router.get(
  "/",
  checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN),
  SellerController.getAllApplication,
);
router.get(
  "/:id",
  checkAuth(ROLE.SELLER, ROLE.SUPER_ADMIN),
  SellerController.getMyApplication,
);
router.post(
  "/",
  checkAuth(ROLE.USER),
  multerUpload.single("cvLink"),
  validateRequest(createSellerValidation),
  SellerController.applyForSeller,
);
router.patch(
  "/:id",
  checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN),
  validateRequest(updateSellerValidation),
  SellerController.reviewApplication,
);
export const sellerRoutes = router;
