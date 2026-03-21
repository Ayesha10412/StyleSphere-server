import { Router } from "express";
import { multerUpload } from "../config/multer.config";
import { validateRequest } from "../middlewares/validateRequest";
import { createProductValidation } from "../modules/validation/product.validation";
import { ProductController } from "../modules/controller/product.controller";
import { parseJSONFields } from "../middlewares/parseJson";
import { checkAuth } from "../middlewares/checkAuth";
import { ROLE } from "../modules/interface/user.interface";

const router = Router();
router.post(
  "/",
  checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN, ROLE.SELLER),
  multerUpload.array("images"),
  parseJSONFields(["variants"]),
  validateRequest(createProductValidation),
  ProductController.createProduct,
);
export const productRoutes = router;
