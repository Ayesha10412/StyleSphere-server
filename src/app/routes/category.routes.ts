import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import { ROLE } from "../modules/interface/user.interface";
import { validateRequest } from "../middlewares/validateRequest";
import { createCategoryValidation } from "../modules/validation/category.validation";
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
export const categoryRoutes = router;
