import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import { ROLE } from "../modules/interface/user.interface";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createCategoryValidation,
  updateCategoryValidation,
} from "../modules/validation/category.validation";
import { CategoryController } from "../modules/controller/category.controller";

const router = Router();
router.get("/", CategoryController.getAllCategory);
router.get("/:id", checkAuth(ROLE.SELLER), CategoryController.categoryDetails);
router.post(
  "/",
  checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN, ROLE.SELLER),
  validateRequest(createCategoryValidation),
  CategoryController.createCategory,
);
router.patch(
  "/:id",
  checkAuth(ROLE.ADMIN, ROLE.SELLER),
  validateRequest(updateCategoryValidation),
  CategoryController.updateCategory,
);
router.delete(
  "/:id",
  checkAuth(ROLE.ADMIN, ROLE.SELLER),
  CategoryController.deleteCategory,
);
export const categoryRoutes = router;
