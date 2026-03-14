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
router.get("/:id", checkAuth(ROLE.SELLER), StoreController.getMyStore);
router.post(
  "/",
  checkAuth(ROLE.SELLER),
  multerUpload.single("banner"),
  validateRequest(createStoreValidation),
  StoreController.createStore,
);
router.patch(
  "/:id",
  checkAuth(ROLE.SELLER, ROLE.ADMIN),
  validateRequest(updateStoreValidation),
  StoreController.updateStore,
);

export const storeRoutes = router;
