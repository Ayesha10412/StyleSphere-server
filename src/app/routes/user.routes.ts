import { Router } from "express";
import { validateRequest } from "../middlewares/validateRequest";
import { createUserValidation, updateUserValidation } from "../modules/validation/user.validation";
import { UserController } from "../modules/controller/user.controller";
import { checkAuth } from "../middlewares/checkAuth";
import { ROLE } from "../modules/interface/user.interface";

const router = Router();
router.get(
  "/",
  //  checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN),
  UserController.getAllUser,
);
router.get("/me", checkAuth(), UserController.getMe);
router.get(
  "/:id",
  checkAuth(ROLE.SUPER_ADMIN, ROLE.ADMIN),
  UserController.getSingleUser,
);
router.post(
  "/register",
  validateRequest(createUserValidation),
  UserController.createUser,
);
router.patch(
  "/:id",
  // checkAuth(...Object.values(ROLE)),
  validateRequest(updateUserValidation),
  UserController.updateUser,
);
router.delete(
  "/:id",
  // checkAuth(...Object.values(ROLE)),
  UserController.deleteUser,
);

export const userRoutes = router;
