import { Router } from "express";
import { validateRequest } from "../middlewares/validateRequest";
import { createUserValidation } from "../modules/validation/user.validation";
import { UserController } from "../modules/controller/user.controller";
import { checkAuth } from "../middlewares/checkAuth";
import { ROLE } from "../modules/interface/user.interface";

const router = Router();
router.get(
  "/",
  //  checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN),
  UserController.getAllUser,
);
router.post(
  "/register",
  validateRequest(createUserValidation),
  UserController.createUser,
);
router.patch(
  "/:id",
  validateRequest(createUserValidation),
  checkAuth(...Object.values(ROLE)),
  UserController.updateUser,
);

export const userRoutes = router;
