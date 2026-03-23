import { Router } from "express";
import { multerUpload } from "../config/multer.config";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createProductValidation,
  updateProductValidation,
} from "../modules/validation/product.validation";
import { ProductController } from "../modules/controller/product.controller";
import { parseJSONFields } from "../middlewares/parseJson";
import { checkAuth } from "../middlewares/checkAuth";
import { ROLE } from "../modules/interface/user.interface";

const router = Router();
router.get("/", ProductController.getAllProduct);
router.get("/:id", ProductController.productDetails);
router.post(
  "/",
  checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN, ROLE.SELLER),
  multerUpload.array("images"),
  parseJSONFields(["variants"]),
  validateRequest(createProductValidation),
  ProductController.createProduct,
);
router.patch(
  "/:id",
  checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN, ROLE.SELLER),
  multerUpload.array("images"),
  parseJSONFields(["variants"]),
  validateRequest(updateProductValidation),
  ProductController.updateProduct,
);
router.delete(
  "/:id",
  checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN, ROLE.SELLER),
  ProductController.deleteProduct,
);
export const productRoutes = router;

// 1. user will search with any case
// 2. user will search with anything related field.
