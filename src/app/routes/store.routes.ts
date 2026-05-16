import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import { ROLE } from "../modules/interface/user.interface";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createStoreValidation,
  updateStoreValidation,
} from "../modules/validation/store.validation";
import { StoreController } from "../modules/controller/store.controller";
import { multerUpload } from "../config/multer.config";

const router = Router();
router.get(
  "/",
  checkAuth(ROLE.SUPER_ADMIN, ROLE.ADMIN),
  StoreController.getAllStore,
);
router.get("/me", checkAuth(ROLE.SELLER,ROLE.SUPER_ADMIN), StoreController.getMyStore);
router.post(
  "/",
  checkAuth(ROLE.SELLER,ROLE.SUPER_ADMIN),
  multerUpload.single("storeBanner"),
  validateRequest(createStoreValidation),
  StoreController.createStore,
);
router.patch(
  "/:id",
  checkAuth(ROLE.SELLER, ROLE.ADMIN,ROLE.SUPER_ADMIN),
  multerUpload.single("storeBanner"),
  validateRequest(updateStoreValidation),
  StoreController.updateStore,
);

export const storeRoutes = router;
///updated super_admin into me, post, patch method for development purpose.