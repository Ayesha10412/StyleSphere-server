import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import { ROLE } from "../modules/interface/user.interface";
import { validateRequest } from "../middlewares/validateRequest";
import { createStoreValidation } from "../modules/validation/store.validation";
import { StoreController } from "../modules/controller/store.controller";
import { multerUpload } from "../config/multer.config";

const router = Router();

router.post(
  "/",
  checkAuth(ROLE.SELLER),
  multerUpload.single("banner"),
  validateRequest(createStoreValidation),
  StoreController.createStore,
);

export const storeRoutes = router;
